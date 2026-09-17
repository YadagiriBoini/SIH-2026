import h5py
import numpy as np
import matplotlib.pyplot as plt


# --------------------------------------------------
# 1. File path
# --------------------------------------------------

file_path = r"Data/satellite/NISAR_.h5"


# --------------------------------------------------
# 2. Dataset paths
# --------------------------------------------------

HH_PATH = "science/SSAR/GCOV/grids/frequencyA/RHRH"
VV_PATH = "science/SSAR/GCOV/grids/frequencyA/RVRV"
HV_PATH = "science/SSAR/GCOV/grids/frequencyA/RHRV"
MASK_PATH = "science/SSAR/GCOV/grids/frequencyA/mask"


# --------------------------------------------------
# 3. Tile location
# --------------------------------------------------

row_start = 1024
col_start = 4096

tile_size = 512


# --------------------------------------------------
# 4. Read one tile
# --------------------------------------------------

with h5py.File(file_path, "r") as f:

    hh = f[HH_PATH][
        row_start:row_start + tile_size,
        col_start:col_start + tile_size
    ]

    vv = f[VV_PATH][
        row_start:row_start + tile_size,
        col_start:col_start + tile_size
    ]

    hv = f[HV_PATH][
        row_start:row_start + tile_size,
        col_start:col_start + tile_size
    ]

    mask = f[MASK_PATH][
        row_start:row_start + tile_size,
        col_start:col_start + tile_size
    ]


# --------------------------------------------------
# 5. Convert HV complex values to magnitude
# --------------------------------------------------

hv_magnitude = np.abs(hv)


# --------------------------------------------------
# 6. Convert backscatter to dB
# --------------------------------------------------

hh_db = np.full(hh.shape, np.nan, dtype=np.float32)
vv_db = np.full(vv.shape, np.nan, dtype=np.float32)
hv_db = np.full(hv_magnitude.shape, np.nan, dtype=np.float32)


valid_hh = np.isfinite(hh) & (hh > 0)
valid_vv = np.isfinite(vv) & (vv > 0)
valid_hv = np.isfinite(hv_magnitude) & (hv_magnitude > 0)


hh_db[valid_hh] = 10 * np.log10(hh[valid_hh])
vv_db[valid_vv] = 10 * np.log10(vv[valid_vv])
hv_db[valid_hv] = 10 * np.log10(hv_magnitude[valid_hv])


# --------------------------------------------------
# 7. Print statistics
# --------------------------------------------------

print("=" * 60)
print("512 x 512 TILE")
print("=" * 60)

print("\nHH / RHRH")
print("Min:", np.nanmin(hh_db))
print("Max:", np.nanmax(hh_db))
print("Mean:", np.nanmean(hh_db))
print("Median:", np.nanmedian(hh_db))

print("\nVV / RVRV")
print("Min:", np.nanmin(vv_db))
print("Max:", np.nanmax(vv_db))
print("Mean:", np.nanmean(vv_db))
print("Median:", np.nanmedian(vv_db))

print("\nHV Magnitude")
print("Min:", np.nanmin(hv_db))
print("Max:", np.nanmax(hv_db))
print("Mean:", np.nanmean(hv_db))
print("Median:", np.nanmedian(hv_db))

print("\nMask values:")
unique, counts = np.unique(mask, return_counts=True)

for value, count in zip(unique, counts):
    print(f"Value {value}: {count}")


# --------------------------------------------------
# 8. Visualize
# --------------------------------------------------

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

axes[0].imshow(hh_db, cmap="gray")
axes[0].set_title("RHRH / HH (dB)")
axes[0].axis("off")

axes[1].imshow(vv_db, cmap="gray")
axes[1].set_title("RVRV / VV (dB)")
axes[1].axis("off")

axes[2].imshow(hv_db, cmap="gray")
axes[2].set_title("|RHRV| / HV (dB)")
axes[2].axis("off")

plt.tight_layout()
plt.show()