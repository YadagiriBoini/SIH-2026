import sys
import os
import io
import base64

import torch
import numpy as np

from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from services.ais_service import find_nearby_vessels
from services.attribution_service import attribute_vessels

# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

ML_PATH = os.path.join(
    PROJECT_ROOT,
    "ML"
)

sys.path.insert(0, ML_PATH)

from unet import UNet
from preprocessing.nisar_preprocess import preprocess_nisar_tile


# ============================================================
# FASTAPI   
# ============================================================

app = FastAPI(
    title="Satellite Oil Spill Attribution API",
    version="1.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LOAD U-NET
# ============================================================

MODEL_PATH = os.path.join(
    PROJECT_ROOT,
    "best_model.pth"
)

model = None

if os.path.exists(MODEL_PATH):
    model = UNet()
    model.load_state_dict(
        torch.load(
            MODEL_PATH,
            map_location="cpu"
        )
    )
    model.eval()
    print("U-Net model loaded successfully")
else:
    print(
        "U-Net model weights not found; health endpoints are available, "
        "but image analysis requires best_model.pth"
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():

    return {
        "message": "Satellite Oil Spill Attribution API"
    }


@app.get("/api/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================================
# EXISTING IMAGE ANALYSIS API
# ============================================================

@app.post("/api/analyze")
async def analyze_spill(
    image: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    observation_date: str = Form(...),
    observation_time: str = Form(...),
    ais_window: int = Form(...)
):

    try:

        if model is None:
            return {
                "status": "error",
                "message": "Model weights are unavailable; add best_model.pth"
            }

        # ----------------------------------------
        # READ IMAGE
        # ----------------------------------------

        image_bytes = await image.read()

        pil_image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        pil_image = pil_image.resize(
            (256, 256)
        )

        image_array = np.array(
            pil_image
        ).astype(
            np.float32
        ) / 255.0

        image_array = np.transpose(
            image_array,
            (2, 0, 1)
        )

        image_tensor = torch.tensor(
            image_array,
            dtype=torch.float32
        ).unsqueeze(0)

        # ----------------------------------------
        # U-NET PREDICTION
        # ----------------------------------------

        with torch.no_grad():

            output = model(
                image_tensor
            )

            probability = torch.sigmoid(
                output
            )

            prediction = (
                probability > 0.5
            ).float()

        prediction = (
            prediction
            .squeeze()
            .numpy()
        )

        # ----------------------------------------
        # CALCULATE SPILL AREA
        # ----------------------------------------

        spill_pixels = int(
            prediction.sum()
        )

        total_pixels = prediction.size

        spill_percentage = (
            spill_pixels / total_pixels
        ) * 100

        spill_detected = (
            spill_pixels > 0
        )

        # ----------------------------------------
        # CREATE MASK IMAGE
        # ----------------------------------------

        mask_image = np.zeros(
            (*prediction.shape, 3),
            dtype=np.uint8
        )
        mask_image[prediction == 0] = [0, 0, 255]
        mask_image[prediction == 1] = [255, 0, 0]

        mask_pil = Image.fromarray(
            mask_image
        )

        mask_buffer = io.BytesIO()

        mask_pil.save(
            mask_buffer,
            format="PNG"
        )

        mask_base64 = base64.b64encode(
            mask_buffer.getvalue()
        ).decode("utf-8")

        # ----------------------------------------
        # RESPONSE
        # ----------------------------------------

        return {

            "status": "success",

            "message": "Oil spill analysis completed",

            "input": {

                "filename": image.filename,

                "latitude": latitude,

                "longitude": longitude,

                "observation_date":
                    observation_date,

                "observation_time":
                    observation_time,

                "ais_window":
                    ais_window
            },

            "prediction": {

                "spill_detected":
                    spill_detected,

                "spill_pixels":
                    spill_pixels,

                "total_pixels":
                    total_pixels,

                "spill_percentage":
                    round(
                        spill_percentage,
                        2
                    ),

                "predicted_mask":
                    mask_base64
            }
        }

    except Exception as e:

        return {

            "status": "error",

            "message": str(e)
        }


# ============================================================
# NISAR ANALYSIS API
# ============================================================

@app.post("/api/analyze-nisar")
async def analyze_nisar(

    row_start: int = Form(1024),

    col_start: int = Form(4096),

    tile_size: int = Form(512)

):

    try:

        if model is None:
            return {
                "status": "error",
                "message": "Model weights are unavailable; add best_model.pth"
            }

        # ----------------------------------------
        # NISAR FILE
        # ----------------------------------------

        satellite_dir = os.path.join(
            PROJECT_ROOT,
            "Data",
            "satellite"
        )

        files = [
            f
            for f in os.listdir(
                satellite_dir
            )
            if f.endswith(
                ".h5"
            )
        ]

        if not files:

            return {
                "status": "error",
                "message":
                    "No NISAR HDF5 file found"
            }

        h5_path = os.path.join(
            satellite_dir,
            files[0]
        )

        print(
            "Using NISAR file:",
            h5_path
        )

        # ----------------------------------------
        # NISAR PREPROCESSING
        # ----------------------------------------

        image, valid_mask = (
            preprocess_nisar_tile(
                h5_path,
                row_start=row_start,
                col_start=col_start,
                tile_size=tile_size
            )
        )

        # ----------------------------------------
        # PREPARE MODEL INPUT
        # ----------------------------------------

        image = np.transpose(
            image,
            (2, 0, 1)
        )

        image_tensor = torch.tensor(
            image,
            dtype=torch.float32
        ).unsqueeze(0)

        # ----------------------------------------
        # U-NET
        # ----------------------------------------

        with torch.no_grad():

            output = model(
                image_tensor
            )

            probability = torch.sigmoid(
                output
            )

            prediction = (
                probability > 0.5
            ).float()

        # ----------------------------------------
        # NUMPY
        # ----------------------------------------

        prediction = (
            prediction
            .squeeze()
            .numpy()
        )

        probability = (
            probability
            .squeeze()
            .numpy()
        )

        # ----------------------------------------
        # APPLY NISAR VALIDITY MASK
        # ----------------------------------------

        prediction[
            ~valid_mask
        ] = 0

        # ----------------------------------------
        # SPILL STATISTICS
        # ----------------------------------------

        spill_pixels = int(
            prediction.sum()
        )

        valid_pixels = int(
            valid_mask.sum()
        )

        if valid_pixels > 0:

            spill_percentage = (
                spill_pixels /
                valid_pixels
            ) * 100

        else:

            spill_percentage = 0

        # ----------------------------------------
        # CREATE MASK
        # ----------------------------------------

        mask_image = np.zeros(
            (*prediction.shape, 3),
            dtype=np.uint8
        )
        mask_image[valid_mask & (prediction == 0)] = [0, 0, 255]
        mask_image[valid_mask & (prediction == 1)] = [255, 0, 0]

        mask_pil = Image.fromarray(
            mask_image
        )

        mask_buffer = io.BytesIO()

        mask_pil.save(
            mask_buffer,
            format="PNG"
        )

        mask_base64 = base64.b64encode(
            mask_buffer.getvalue()
        ).decode("utf-8")

        # ----------------------------------------
        # RESPONSE
        # ----------------------------------------

        return {

            "status":
                "success",

            "message":
                "NISAR oil spill analysis completed",

            "tile": {

                "row_start":
                    row_start,

                "col_start":
                    col_start,

                "tile_size":
                    tile_size
            },

            "prediction": {

                "spill_detected":
                    spill_pixels > 0,

                "spill_pixels":
                    spill_pixels,

                "valid_pixels":
                    valid_pixels,

                "spill_percentage":
                    round(
                        spill_percentage,
                        2
                    ),

                "probability_mean":
                    float(
                        probability.mean()
                    ),

                "probability_min":
                    float(
                        probability.min()
                    ),

                "probability_max":
                    float(
                        probability.max()
                    ),

                "predicted_mask":
                    mask_base64
            }
        }

    except Exception as e:

        return {

            "status":
                "error",

            "message":
                str(e)
        }
     # ============================================================
# AIS ANALYSIS
# ============================================================

@app.post("/api/ais")
async def analyze_ais(
    latitude: float = Form(...),
    longitude: float = Form(...),
    radius_km: float = Form(50)
):

    try:

        vessels = [
            {
                "mmsi": "123456789",
                "name": "DEMO TANKER 01",
                "type": "Tanker",
                "latitude": 17.55,
                "longitude": 78.52,
                "speed": 12.4,
                "course": 135
            },
            {
                "mmsi": "987654321",
                "name": "DEMO CARGO 01",
                "type": "Cargo",
                "latitude": 17.62,
                "longitude": 78.60,
                "speed": 9.8,
                "course": 220
            },
            {
                "mmsi": "555666777",
                "name": "DEMO TANKER 02",
                "type": "Tanker",
                "latitude": 18.10,
                "longitude": 79.10,
                "speed": 14.2,
                "course": 80
            }
        ]

        nearby = find_nearby_vessels(
            vessels,
            latitude,
            longitude,
            radius_km
        )

        attributed_vessels = attribute_vessels(
            nearby
        )

        return {
            "status": "success",
            "observation_location": {
                "latitude": latitude,
                "longitude": longitude
            },

            "radius_km": radius_km,

            "vessel_count": len(attributed_vessels),

            "vessels": attributed_vessels,

            "attribution": {
                "model": "XGBoost",
                "status": "demo"
            },

            "data_source": "demo"
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }