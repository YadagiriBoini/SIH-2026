import torch
import numpy as np
from PIL import Image

from unet import UNet


# ============================================================
# 1. Device
# ============================================================

device = torch.device("cpu")

print("Device:", device)


# ============================================================
# 2. Load model
# ============================================================

model = UNet()

model.load_state_dict(
    torch.load(
        "best_model.pth",
        map_location=device
    )
)

model = model.to(device)

model.eval()

print("Model loaded successfully.")


# ============================================================
# 3. Input image
# ============================================================

image_path = (
    "Data/oil_spill_dataset/"
    "images/images/val/palsar_0.png"
)


# ============================================================
# 4. Read image
# ============================================================

image = Image.open(image_path).convert("RGB")

image_array = np.array(image)


# ============================================================
# 5. Normalize
# ============================================================

image_array = image_array.astype(
    np.float32
) / 255.0


# ============================================================
# 6. Convert HWC → CHW
# ============================================================

image_array = np.transpose(
    image_array,
    (2, 0, 1)
)


# ============================================================
# 7. Convert to Tensor
# ============================================================

image_tensor = torch.tensor(
    image_array,
    dtype=torch.float32
)


# Add batch dimension

image_tensor = image_tensor.unsqueeze(0)


image_tensor = image_tensor.to(device)


# ============================================================
# 8. Prediction
# ============================================================

with torch.no_grad():

    prediction = model(
        image_tensor
    )

    prediction = torch.sigmoid(
        prediction
    )


# ============================================================
# 9. Convert prediction to binary mask
# ============================================================

prediction = (
    prediction > 0.5
).float()


# Remove batch/channel dimensions

prediction = prediction.squeeze().cpu().numpy()


# ============================================================
# 10. Convert 0/1 → 0/255
# ============================================================

mask = (
    prediction * 255
).astype(np.uint8)


# ============================================================
# 11. Save predicted mask
# ============================================================

output_path = "predicted_mask.png"

Image.fromarray(mask).save(
    output_path
)


# ============================================================
# 12. Print information
# ============================================================

spill_pixels = np.sum(
    prediction == 1
)

total_pixels = prediction.size

spill_percentage = (
    spill_pixels / total_pixels
) * 100


print()
print("=" * 60)

print("PREDICTION COMPLETE")

print("=" * 60)

print(
    "Input image:",
    image_path
)

print(
    "Output mask:",
    output_path
)

print(
    "Spill pixels:",
    spill_pixels
)

print(
    "Total pixels:",
    total_pixels
)

print(
    f"Spill percentage: "
    f"{spill_percentage:.2f}%"
)

print("=" * 60)