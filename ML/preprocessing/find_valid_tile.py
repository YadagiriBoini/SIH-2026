import h5py
import numpy as np


# --------------------------------------------------
# 1. File path
# --------------------------------------------------

file_path = r"Data/satellite/NISAR_.h5"


# --------------------------------------------------
# 2. Mask dataset
# --------------------------------------------------

MASK_PATH = "science/SSAR/GCOV/grids/frequencyA/mask"


# --------------------------------------------------
# 3. Tile size
# --------------------------------------------------

tile_size = 512


# --------------------------------------------------
# 4. Open file
# --------------------------------------------------

with h5py.File(file_path, "r") as f:

    mask_dataset = f[MASK_PATH]

    height, width = mask_dataset.shape

    best_row = None
    best_col = None
    best_valid_pixels = 0

    total_tiles = 0

    # --------------------------------------------------
    # Search every 512 x 512 tile
    # --------------------------------------------------

    for row in range(0, height - tile_size + 1, tile_size):

        for col in range(0, width - tile_size + 1, tile_size):

            mask_tile = mask_dataset[
                row:row + tile_size,
                col:col + tile_size
            ]

            valid_pixels = np.sum(mask_tile != 255)

            total_tiles += 1

            if valid_pixels > best_valid_pixels:

                best_valid_pixels = valid_pixels
                best_row = row
                best_col = col

    # --------------------------------------------------
    # Results
    # --------------------------------------------------

    total_pixels = tile_size * tile_size

    valid_percentage = (
        best_valid_pixels / total_pixels
    ) * 100

    print("=" * 60)
    print("BEST 512 x 512 TILE")
    print("=" * 60)

    print("Row start:", best_row)
    print("Column start:", best_col)

    print("Valid pixels:", best_valid_pixels)

    print("Total pixels:", total_pixels)

    print(f"Valid percentage: {valid_percentage:.2f}%")

    # --------------------------------------------------
    # Inspect mask values
    # --------------------------------------------------

    best_mask = mask_dataset[
        best_row:best_row + tile_size,
        best_col:best_col + tile_size
    ]

    unique, counts = np.unique(
        best_mask,
        return_counts=True
    )

    print("\nMask values:")

    for value, count in zip(unique, counts):

        percentage = (count / total_pixels) * 100

        print(
            f"Value {value}: "
            f"{count} pixels "
            f"({percentage:.2f}%)"
        )

    print("\nTotal tiles checked:", total_tiles)