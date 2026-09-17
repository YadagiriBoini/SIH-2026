import sys
import os
import torch
import numpy as np

# Get project root
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../..")
)

# Force Python to use project ML folder
ML_PATH = os.path.join(PROJECT_ROOT, "ML")

sys.path.insert(0, ML_PATH)

from unet import UNet
from preprocessing.nisar_preprocess import preprocess_nisar_tile


# ==============================
# PATHS
# ==============================

H5_PATH = os.path.join(
    PROJECT_ROOT,
    "Data",
    "satellite",
    "NISAR_.h5"
)

MODEL_PATH = os.path.join(
    PROJECT_ROOT,
    "best_model.pth"
)


# ==============================
# LOAD NISAR TILE
# ==============================

image, valid_mask = preprocess_nisar_tile(
    H5_PATH,
    row_start=1024,
    col_start=4096,
    tile_size=512
)

print("=" * 60)
print("NISAR → U-NET PREDICTION")
print("=" * 60)

print("\nNISAR image shape:", image.shape)


# ==============================
# CONVERT TO TORCH
# ==============================

image = np.transpose(image, (2, 0, 1))

image_tensor = torch.tensor(
    image,
    dtype=torch.float32
)

image_tensor = image_tensor.unsqueeze(0)

print("Model input shape:", image_tensor.shape)


# ==============================
# LOAD MODEL
# ==============================

print("\nLoading U-Net...")

model = UNet()

checkpoint = torch.load(
    MODEL_PATH,
    map_location="cpu"
)

model.load_state_dict(checkpoint)

model.eval()

print("Model loaded successfully")


# ==============================
# RUN PREDICTION
# ==============================

print("\nRunning prediction...")

with torch.no_grad():

    output = model(image_tensor)

    probability = torch.sigmoid(output)

    prediction = (
        probability > 0.5
    ).float()


# ==============================
# CONVERT TO NUMPY
# ==============================

prediction = prediction.squeeze().numpy()
probability = probability.squeeze().numpy()


# ==============================
# RESULTS
# ==============================

spill_pixels = int(prediction.sum())

total_pixels = prediction.size

spill_percentage = (
    spill_pixels / total_pixels
) * 100


print("\nPrediction shape:", prediction.shape)

print("Probability min:", probability.min())
print("Probability max:", probability.max())
print("Probability mean:", probability.mean())

print("\nSpill pixels:", spill_pixels)
print("Total pixels:", total_pixels)

print(
    "Spill percentage:",
    round(spill_percentage, 2),
    "%"
)

print("\n" + "=" * 60)
print("NISAR U-NET PREDICTION COMPLETE")
print("=" * 60)