import h5py
import numpy as np
import sys


HH_PATH = "science/SSAR/GCOV/grids/frequencyA/RHRH"
VV_PATH = "science/SSAR/GCOV/grids/frequencyA/RVRV"
HV_PATH = "science/SSAR/GCOV/grids/frequencyA/RHRV"
MASK_PATH = "science/SSAR/GCOV/grids/frequencyA/mask"


def print_stats(name, data):

    print("\n" + "=" * 60)
    print(name)
    print("=" * 60)

    print("Shape:", data.shape)
    print("Data type:", data.dtype)

    finite = np.isfinite(data)

    print("Finite pixels:", np.sum(finite))
    print("Non-finite pixels:", np.sum(~finite))

    if np.any(finite):

        values = data[finite]

        print("Min:", np.min(values))
        print("Max:", np.max(values))
        print("Mean:", np.mean(values))
        print("Median:", np.median(values))
        print("Std:", np.std(values))

        print("Percentiles:")
        print("  1% :", np.percentile(values, 1))
        print("  5% :", np.percentile(values, 5))
        print("  25%:", np.percentile(values, 25))
        print("  75%:", np.percentile(values, 75))
        print("  95%:", np.percentile(values, 95))
        print("  99%:", np.percentile(values, 99))


def main(file_path):

    with h5py.File(file_path, "r") as f:

        hh = f[HH_PATH][:]
        vv = f[VV_PATH][:]
        hv = f[HV_PATH][:]

        mask = f[MASK_PATH][:]

        print_stats("RHRH / HH", hh)
        print_stats("RVRV / VV", vv)

        hv_magnitude = np.abs(hv)

        print_stats("|RHRV| / HV Magnitude", hv_magnitude)

        print("\n" + "=" * 60)
        print("MASK")
        print("=" * 60)

        print("Shape:", mask.shape)
        print("Data type:", mask.dtype)

        unique, counts = np.unique(mask, return_counts=True)

        for value, count in zip(unique, counts):

            print(
                f"Value {value}: "
                f"{count} pixels"
            )


if __name__ == "__main__":

    if len(sys.argv) != 2:

        print(
            "Usage: "
            "python inspect_values.py <file>"
        )

        sys.exit(1)

    main(sys.argv[1])