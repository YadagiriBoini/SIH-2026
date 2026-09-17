import torch

from dataset import OilSpillDataset
from torch.utils.data import DataLoader

from unet import UNet
from loss import DiceBCELoss


# ============================================================
# Dataset
# ============================================================

image_dir = (
    "Data/oil_spill_dataset/"
    "images/images/train"
)

mask_dir = (
    "Data/oil_spill_dataset/"
    "masks/masks/train"
)


dataset = OilSpillDataset(
    image_dir,
    mask_dir
)


# ============================================================
# DataLoader
# ============================================================

loader = DataLoader(
    dataset,
    batch_size=8,
    shuffle=True,
    num_workers=0
)


# ============================================================
# Get batch
# ============================================================

images, masks = next(iter(loader))


# ============================================================
# Model
# ============================================================

model = UNet()


# ============================================================
# Forward pass
# ============================================================

predictions = model(images)


# ============================================================
# Loss
# ============================================================

criterion = DiceBCELoss()

loss = criterion(
    predictions,
    masks
)


# ============================================================
# Print
# ============================================================

print("=" * 60)
print("LOSS FUNCTION TEST")
print("=" * 60)

print("\nPredictions:")
print(predictions.shape)

print("\nTargets:")
print(masks.shape)

print("\nLoss:")
print(loss.item())