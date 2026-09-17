from nisar_preprocess import preprocess_nisar_tile


H5_PATH = (
    "Data/satellite/"
    "NISAR_.h5"
)


image, valid_mask = preprocess_nisar_tile(
    H5_PATH,
    row_start=1024,
    col_start=4096,
    tile_size=512
)


print("=" * 60)
print("NISAR CHANNEL TEST")
print("=" * 60)


print("\nComplete image:")
print("Shape:", image.shape)
print("Dtype:", image.dtype)


# ============================================================
# CHANNEL 1
# ============================================================

channel_1 = image[:, :, 0]

print("\nChannel 1 - RHRH")
print("Shape:", channel_1.shape)
print("Min:", channel_1.min())
print("Max:", channel_1.max())
print("Mean:", channel_1.mean())


# ============================================================
# CHANNEL 2
# ============================================================

channel_2 = image[:, :, 1]

print("\nChannel 2 - RVRV")
print("Shape:", channel_2.shape)
print("Min:", channel_2.min())
print("Max:", channel_2.max())
print("Mean:", channel_2.mean())


# ============================================================
# CHANNEL 3
# ============================================================

channel_3 = image[:, :, 2]

print("\nChannel 3 - RHRV")
print("Shape:", channel_3.shape)
print("Min:", channel_3.min())
print("Max:", channel_3.max())
print("Mean:", channel_3.mean())


# ============================================================
# VALID MASK
# ============================================================

print("\nValidity Mask")

print(
    "Valid pixels:",
    valid_mask.sum()
)

print(
    "Valid percentage:",
    valid_mask.mean() * 100
)


print("\n" + "=" * 60)
print("CHANNEL TEST COMPLETE")
print("=" * 60)