from dataset import OilSpillDataset
from torch.utils.data import DataLoader


# ============================================================
# Validation dataset paths
# ============================================================

image_dir = (
    "Data/oil_spill_dataset/"
    "images/images/val"
)

mask_dir = (
    "Data/oil_spill_dataset/"
    "masks/masks/val"
)


# ============================================================
# Create validation dataset
# ============================================================

dataset = OilSpillDataset(
    image_dir,
    mask_dir
)


# ============================================================
# Create DataLoader
# ============================================================

loader = DataLoader(
    dataset,
    batch_size=2,
    shuffle=False,
    num_workers=0
)


# ============================================================
# Get one validation batch
# ============================================================

images, masks = next(iter(loader))


# ============================================================
# Print
# ============================================================

print("=" * 60)
print("VALIDATION DATALOADER TEST")
print("=" * 60)

print("\nValidation dataset size:")
print(len(dataset))

print("\nImages:")
print(images.shape)

print("\nMasks:")
print(masks.shape)