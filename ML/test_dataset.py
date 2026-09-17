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
# Dataset size
# --------------------------------------------------

print("\nDataset size:")
print(len(dataset))


# --------------------------------------------------
# Load first image/mask
# --------------------------------------------------

image, mask = dataset[0]


# --------------------------------------------------
# Print information
# --------------------------------------------------

print("\nImage:")
print("Shape:", image.shape)
print("dtype:", image.dtype)
print("Min:", image.min().item())
print("Max:", image.max().item())


print("\nMask:")
print("Shape:", mask.shape)
print("dtype:", mask.dtype)
print("Min:", mask.min().item())
print("Max:", mask.max().item())