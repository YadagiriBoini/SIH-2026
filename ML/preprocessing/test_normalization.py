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
# 4. Read tile
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
# 5. HV magnitude
# --------------------------------------------------

hv_magnitude = np.abs(hv)


# --------------------------------------------------
# 6. Convert to dB
# --------------------------------------------------

def to_db(data):
    """
    Convert positive backscatter values to dB.
    """

    result = np.full(
        data.shape,
        np.nan,
        dtype=np.float32
    )

    valid = np.isfinite(data) & (data > 0)

    result[valid] = 10 * np.log10(data[valid])

    return result


hh_db = to_db(hh)
vv_db = to_db(vv)
hv_db = to_db(hv_magnitude)


# --------------------------------------------------
# 7. Robust normalization
# --------------------------------------------------

def normalize(data):
    """
    Normalize valid dB values to approximately 0-1.

    Uses the 1st and 99th percentiles
    to reduce the effect of extreme values.
    """

    valid = np.isfinite(data)

    low = np.percentile(data[valid], 1)
    high = np.percentile(data[valid], 99)

    normalized = np.zeros(
        data.shape,
        dtype=np.float32
    )

    normalized[valid] = (
        data[valid] - low
    ) / (high - low)

    normalized = np.clip(
        normalized,
        0,
        1
    )

    return normalized, low, high


hh_norm, hh_low, hh_high = normalize(hh_db)
vv_norm, vv_low, vv_high = normalize(vv_db)
hv_norm, hv_low, hv_high = normalize(hv_db)


# --------------------------------------------------
# 8. Print normalization values
# --------------------------------------------------

print("=" * 60)
print("NORMALIZATION RESULTS")
print("=" * 60)

print("\nRHRH / HH")
print("1% percentile :", hh_low)
print("99% percentile:", hh_high)

print("\nRVRV / VV")
print("1% percentile :", vv_low)
print("99% percentile:", vv_high)

print("\n|RHRV| / HV")
print("1% percentile :", hv_low)
print("99% percentile:", hv_high)


# --------------------------------------------------
# 9. Create 3-channel image
# --------------------------------------------------

image = np.stack(
    [
        hh_norm,
        vv_norm,
        hv_norm
    ],
    axis=-1
)


print("\nFinal image shape:")
print(image.shape)

print("Final data type:")
print(image.dtype)

print("Final minimum:")
print(image.min())

print("Final maximum:")
print(image.max())


# --------------------------------------------------
# 10. Display normalized channels
# --------------------------------------------------

fig, axes = plt.subplots(
    1,
    3,
    figsize=(15, 5)
)

axes[0].imshow(hh_norm, cmap="gray", vmin=0, vmax=1)
axes[0].set_title("RHRH normalized")

axes[1].imshow(vv_norm, cmap="gray", vmin=0, vmax=1)
axes[1].set_title("RVRV normalized")

axes[2].imshow(hv_norm, cmap="gray", vmin=0, vmax=1)
axes[2].set_title("|RHRV| normalized")

for ax in axes:
    ax.axis("off")

plt.tight_layout()
plt.show()