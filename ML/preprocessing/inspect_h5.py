import h5py
import sys
from pathlib import Path


def inspect_large_datasets(file_path):

    file_path = Path(file_path)

    if not file_path.exists():
        print("File not found:", file_path)
        return

    print("=" * 70)
    print("NISAR LARGE DATASET INSPECTION")
    print("=" * 70)

    with h5py.File(file_path, "r") as h5_file:

        def check_dataset(name, obj):

            if isinstance(obj, h5py.Dataset):

                if len(obj.shape) >= 2:

                    print("\nDATASET:")
                    print(name)

                    print("Shape:", obj.shape)
                    print("Data type:", obj.dtype)

                    if obj.chunks:
                        print("Chunks:", obj.chunks)

                    print("Compression:", obj.compression)

        h5_file.visititems(check_dataset)

    print("\n" + "=" * 70)
    print("Inspection complete")
    print("=" * 70)


if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("Usage:")
        print("python inspect_h5.py <file>")
        sys.exit(1)

    inspect_large_datasets(sys.argv[1])