import torch

from dataset import OilSpillDataset
from torch.utils.data import DataLoader

from unet import UNet


# ============================================================
# 1. Dataset
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
# 2. DataLoader
# ============================================================

loader = DataLoader(
    dataset,
    batch_size=8,
    shuffle=True,
    num_workers=0
)


# ============================================================
# 3. Get one batch
# ============================================================

images, masks = next(iter(loader))


# ============================================================
# 4. Create U-Net
# ============================================================

model = UNet()


# ============================================================
# 5. Forward pass
# ============================================================

outputs = model(images)


# ============================================================
# 6. Print results
# ============================================================

print("=" * 60)
print("U-NET TEST")
print("=" * 60)

print("\nInput:")
print(images.shape)

print("\nTarget mask:")
print(masks.shape)

print("\nModel output:")
print(outputs.shape)

print("\nOutput dtype:")
print(outputs.dtype)