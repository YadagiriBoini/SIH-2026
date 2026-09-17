import sys
import os

import torch
import numpy as np
from PIL import Image

# ==============================
# PROJECT PATH
# ==============================

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../..")
)

sys.path.insert(
    0,
    os.path.join(PROJECT_ROOT, "ML")
)

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

OUTPUT_PATH = os.path.join(
    PROJECT_ROOT,
    "nisar_predicted_mask.png"
)


# ==============================
# LOAD NISAR
# ==============================

image, valid_mask = preprocess_nisar_tile(
    H5_PATH,
    row_start=1024,
    col_start=4096,
    tile_size=512
)


# ==============================
# PREPARE INPUT
# ==============================

image = np.transpose(
    image,
    (2, 0, 1)
)

image_tensor = torch.tensor(
    image,
    dtype=torch.float32
).unsqueeze(0)


# ==============================
# LOAD MODEL
# ==============================

model = UNet()

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location="cpu"
    )
)

model.eval()


# ==============================
# PREDICTION
# ==============================

with torch.no_grad():

    output = model(image_tensor)

    probability = torch.sigmoid(output)

    prediction = (
        probability > 0.5
    ).float()


# ==============================
# NUMPY
# ==============================

prediction = prediction.squeeze().numpy()


# ==============================
# APPLY VALIDITY MASK
# ==============================

prediction[~valid_mask] = 0


# ==============================
# SAVE MASK
# ==============================

mask_image = (
    prediction * 255
).astype(np.uint8)

Image.fromarray(
    mask_image
).save(OUTPUT_PATH)


# ==============================
# RESULTS
# ==============================

spill_pixels = int(
    prediction.sum()
)

total_pixels = int(
    valid_mask.sum()
)

spill_percentage = (
    spill_pixels / total_pixels
) * 100


print("=" * 60)
print("NISAR PREDICTED MASK")
print("=" * 60)

print("\nOutput file:")
print(OUTPUT_PATH)

print("\nMask shape:")
print(prediction.shape)

print("\nSpill pixels:")
print(spill_pixels)

print("\nValid pixels:")
print(total_pixels)

print("\nSpill percentage:")
print(round(spill_percentage, 2), "%")

print("\nMask saved successfully!")

print("\n" + "=" * 60)