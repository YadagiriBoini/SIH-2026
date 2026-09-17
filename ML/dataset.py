from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torch.utils.data import Dataset


class OilSpillDataset(Dataset):

    def __init__(self, image_dir, mask_dir):

        self.image_dir = Path(image_dir)
        self.mask_dir = Path(mask_dir)

        self.images = sorted(
            self.image_dir.glob("*.png")
        )

        print("Images found:", len(self.images))

    def __len__(self):

        return len(self.images)

    def __getitem__(self, index):

        # --------------------------------------------------
        # 1. Get image path
        # --------------------------------------------------

        image_path = self.images[index]

        # --------------------------------------------------
        # 2. Get corresponding mask path
        # --------------------------------------------------

        mask_path = self.mask_dir / image_path.name

        # --------------------------------------------------
        # 3. Load image
        # --------------------------------------------------

        image = Image.open(image_path).convert("RGB")

        # --------------------------------------------------
        # 4. Load mask
        # --------------------------------------------------

        mask = Image.open(mask_path)

        # --------------------------------------------------
        # 5. Convert to NumPy
        # --------------------------------------------------

        image = np.array(image)
        mask = np.array(mask)

        # --------------------------------------------------
        # 6. Normalize image
        # --------------------------------------------------

        image = image.astype(np.float32) / 255.0

        # --------------------------------------------------
        # 7. Handle mask format
        # --------------------------------------------------

        if mask.ndim == 3:

            # RGB mask
            mask = mask[:, :, 0]

        elif mask.ndim == 2:

            # Already grayscale
            mask = mask

        else:

            raise ValueError(
                f"Unexpected mask shape: {mask.shape}"
            )

        # --------------------------------------------------
        # 8. Convert mask 0/255 → 0/1
        # --------------------------------------------------

        mask = (
            mask > 0
        ).astype(np.float32)

        # --------------------------------------------------
        # 9. Convert image HWC → CHW
        # --------------------------------------------------

        image = np.transpose(
            image,
            (2, 0, 1)
        )

        # --------------------------------------------------
        # 10. Add mask channel
        # --------------------------------------------------

        mask = np.expand_dims(
            mask,
            axis=0
        )

        # --------------------------------------------------
        # 11. NumPy → PyTorch
        # --------------------------------------------------

        image = torch.tensor(
            image,
            dtype=torch.float32
        )

        mask = torch.tensor(
            mask,
            dtype=torch.float32
        )

        return image, mask