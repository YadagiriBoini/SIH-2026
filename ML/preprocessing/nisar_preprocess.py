import h5py
import numpy as np


# ============================================================
# NISAR DATASET PATHS
# ============================================================

RHRH_PATH = (
    "science/SSAR/GCOV/grids/"
    "frequencyA/RHRH"
)

RVRV_PATH = (
    "science/SSAR/GCOV/grids/"
    "frequencyA/RVRV"
)

RHRV_PATH = (
    "science/SSAR/GCOV/grids/"
    "frequencyA/RHRV"
)

MASK_PATH = (
    "science/SSAR/GCOV/grids/"
    "frequencyA/mask"
)


# ============================================================
# READ NISAR TILE
# ============================================================

def read_nisar_tile(
    h5_path,
    row_start,
    col_start,
    tile_size=512
):

    with h5py.File(h5_path, "r") as h5:

        # ----------------------------------------------------
        # Read RHRH
        # ----------------------------------------------------

        rhrh = h5[RHRH_PATH][
            row_start:row_start + tile_size,
            col_start:col_start + tile_size
        ]

        # ----------------------------------------------------
        # Read RVRV
        # ----------------------------------------------------

        rvrv = h5[RVRV_PATH][
            row_start:row_start + tile_size,
            col_start:col_start + tile_size
        ]

        # ----------------------------------------------------
        # Read RHRV
        # ----------------------------------------------------

        rhrv = h5[RHRV_PATH][
            row_start:row_start + tile_size,
            col_start:col_start + tile_size
        ]

        # ----------------------------------------------------
        # Read NISAR validity mask
        # ----------------------------------------------------

        mask = h5[MASK_PATH][
            row_start:row_start + tile_size,
            col_start:col_start + tile_size
        ]


    return rhrh, rvrv, rhrv, mask


# ============================================================
# CONVERT BACKSCATTER TO dB
# ============================================================

def to_db(data):

    data = np.asarray(
        data,
        dtype=np.float32
    )

    # Invalid values become NaN
    valid = (
        np.isfinite(data) &
        (data > 0)
    )

    result = np.full(
        data.shape,
        np.nan,
        dtype=np.float32
    )

    result[valid] = (
        10.0 *
        np.log10(data[valid])
    )

    return result


# ============================================================
# NORMALIZE ONE CHANNEL
# ============================================================

def normalize_channel(
    channel,
    lower_percentile=1,
    upper_percentile=99
):

    channel = channel.astype(
        np.float32
    )

    valid = np.isfinite(channel)

    if not np.any(valid):

        return np.zeros_like(
            channel,
            dtype=np.float32
        )

    low = np.percentile(
        channel[valid],
        lower_percentile
    )

    high = np.percentile(
        channel[valid],
        upper_percentile
    )

    if high <= low:

        result = np.zeros_like(
            channel,
            dtype=np.float32
        )

        result[valid] = 0.5

        return result

    result = np.zeros_like(
        channel,
        dtype=np.float32
    )

    result[valid] = (
        channel[valid] - low
    ) / (
        high - low
    )

    result = np.clip(
        result,
        0.0,
        1.0
    )

    return result


# ============================================================
# PREPROCESS NISAR TILE
# ============================================================

def preprocess_nisar_tile(
    h5_path,
    row_start,
    col_start,
    tile_size=512
):

    # --------------------------------------------------------
    # Read raw NISAR data
    # --------------------------------------------------------

    rhrh, rvrv, rhrv, mask = read_nisar_tile(
        h5_path,
        row_start,
        col_start,
        tile_size
    )


    # --------------------------------------------------------
    # Convert to dB
    # --------------------------------------------------------

    rhrh_db = to_db(
        rhrh
    )

    rvrv_db = to_db(
        rvrv
    )

    # RHRV is complex
    rhrv_magnitude = np.abs(
        rhrv
    )

    rhrv_db = to_db(
        rhrv_magnitude
    )


    # --------------------------------------------------------
    # Apply NISAR validity mask
    # --------------------------------------------------------

    valid_mask = (
        mask == 1
    )

    rhrh_db[~valid_mask] = np.nan
    rvrv_db[~valid_mask] = np.nan
    rhrv_db[~valid_mask] = np.nan


    # --------------------------------------------------------
    # Normalize
    # --------------------------------------------------------

    rhrh_norm = normalize_channel(
        rhrh_db
    )

    rvrv_norm = normalize_channel(
        rvrv_db
    )

    rhrv_norm = normalize_channel(
        rhrv_db
    )


    # --------------------------------------------------------
    # Create 3-channel image
    # --------------------------------------------------------

    image = np.stack(
        [
            rhrh_norm,
            rvrv_norm,
            rhrv_norm
        ],
        axis=-1
    )


    # --------------------------------------------------------
    # Replace invalid pixels
    # --------------------------------------------------------

    image = np.nan_to_num(
        image,
        nan=0.0,
        posinf=0.0,
        neginf=0.0
    )


    # --------------------------------------------------------
    # Return
    # --------------------------------------------------------

    return (
        image.astype(np.float32),
        valid_mask
    )