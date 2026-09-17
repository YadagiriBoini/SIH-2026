import torch
from torch.utils.data import DataLoader

from dataset import OilSpillDataset


# --------------------------------------------------
# Dataset paths
# --------------------------------------------------

image_dir = (
    "Data/oil_spill_dataset/"
    "images/images/train"
)

mask_dir = (
    "Data/oil_spill_dataset/"
    "masks/masks/train"
)


# --------------------------------------------------
# Create dataset
# --------------------------------------------------

dataset = OilSpillDataset(
    image_dir,
    mask_dir
)


# --------------------------------------------------
# Create DataLoader
# --------------------------------------------------

loader = DataLoader(
    dataset,
    batch_size=8,
    shuffle=True,
    num_workers=0
)


# --------------------------------------------------
# Get one batch
# --------------------------------------------------

images, masks = next(iter(loader))


# --------------------------------------------------
# Print information
# --------------------------------------------------

print("=" * 60)
print("DATALOADER TEST")
print("=" * 60)

print("\nImages:")
print("Shape:", images.shape)
print("dtype:", images.dtype)
print("Min:", images.min().item())
print("Max:", images.max().item())

print("\nMasks:")
print("Shape:", masks.shape)
print("dtype:", masks.dtype)
print("Min:", masks.min().item())
print("Max:", masks.max().item())