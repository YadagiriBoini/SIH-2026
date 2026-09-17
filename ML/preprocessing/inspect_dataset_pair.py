from PIL import Image
import numpy as np
import matplotlib.pyplot as plt


# --------------------------------------------------
# 1. File paths
# --------------------------------------------------

image_path = (
    "Data/oil_spill_dataset/"
    "images/images/train/palsar_0.png"
)

mask_path = (
    "Data/oil_spill_dataset/"
    "masks/masks/train/palsar_0.png"
)


# --------------------------------------------------
# 2. Load image and mask
# --------------------------------------------------

image = Image.open(image_path)
mask = Image.open(mask_path)


# --------------------------------------------------
# 3. Convert to NumPy arrays
# --------------------------------------------------

image_array = np.array(image)
mask_array = np.array(mask)

# --------------------------------------------------
# Check whether mask RGB channels are identical
# --------------------------------------------------

if mask_array.ndim == 3 and mask_array.shape[2] == 3:

    channel_1 = mask_array[:, :, 0]
    channel_2 = mask_array[:, :, 1]
    channel_3 = mask_array[:, :, 2]

    print("\n" + "=" * 60)
    print("MASK CHANNEL CHECK")
    print("=" * 60)

    print(
        "Channel 1 == Channel 2:",
        np.array_equal(channel_1, channel_2)
    )

    print(
        "Channel 2 == Channel 3:",
        np.array_equal(channel_2, channel_3)
    )

    print(
        "Channel 1 == Channel 3:",
        np.array_equal(channel_1, channel_3)
    )

    
# --------------------------------------------------
# 4. Print information
# --------------------------------------------------

print("=" * 60)
print("IMAGE")
print("=" * 60)

print("Shape:", image_array.shape)
print("Data type:", image_array.dtype)
print("Min:", image_array.min())
print("Max:", image_array.max())


print("\n" + "=" * 60)
print("MASK")
print("=" * 60)

print("Shape:", mask_array.shape)
print("Data type:", mask_array.dtype)
print("Min:", mask_array.min())
print("Max:", mask_array.max())


# --------------------------------------------------
# 5. Mask unique values
# --------------------------------------------------

unique, counts = np.unique(
    mask_array,
    return_counts=True
)

print("\nMask values:")

for value, count in zip(unique, counts):

    percentage = (
        count / mask_array.size
    ) * 100

    print(
        f"Value {value}: "
        f"{count} pixels "
        f"({percentage:.2f}%)"
    )


# --------------------------------------------------
# 6. Check image/mask dimensions
# --------------------------------------------------

print("\n" + "=" * 60)
print("DIMENSION CHECK")
print("=" * 60)

print("Image height:", image_array.shape[0])
print("Image width :", image_array.shape[1])

print("Mask height :", mask_array.shape[0])
print("Mask width  :", mask_array.shape[1])

if image_array.shape[:2] == mask_array.shape[:2]:
    print("\nImage and mask dimensions MATCH.")
else:
    print("\nImage and mask dimensions DO NOT MATCH.")


# --------------------------------------------------
# 7. Display image and mask
# --------------------------------------------------

fig, axes = plt.subplots(
    1,
    2,
    figsize=(12, 5)
)

axes[0].imshow(image_array, cmap="gray")
axes[0].set_title("PALSAR Image")
axes[0].axis("off")

axes[1].imshow(mask_array, cmap="gray")
axes[1].set_title("Oil Spill Mask")
axes[1].axis("off")

plt.tight_layout()
plt.show()