import torch
from torch.utils.data import DataLoader

from dataset import OilSpillDataset
from unet import UNet
from loss import DiceBCELoss


# ============================================================
# 1. Device
# ============================================================

device = torch.device("cpu")

print("Device:", device)


# ============================================================
# 2. Dataset paths
# ============================================================

train_image_dir = "Data/oil_spill_dataset/images/images/train"
train_mask_dir = "Data/oil_spill_dataset/masks/masks/train"

val_image_dir = "Data/oil_spill_dataset/images/images/val"
val_mask_dir = "Data/oil_spill_dataset/masks/masks/val"


# ============================================================
# 3. Create datasets
# ============================================================

train_dataset = OilSpillDataset(
    train_image_dir,
    train_mask_dir
)


val_dataset = OilSpillDataset(
    val_image_dir,
    val_mask_dir
)



print("Training images:", len(train_dataset))
print("Validation images:", len(val_dataset))


# ============================================================
# 4. DataLoaders
# ============================================================

train_loader = DataLoader(
    train_dataset,
    batch_size=2,
    shuffle=True,
    num_workers=0
)

val_loader = DataLoader(
    val_dataset,
    batch_size=2,
    shuffle=False,
    num_workers=0
)


# ============================================================
# 5. Model
# ============================================================

model = UNet()

model = model.to(device)


# ============================================================
# 6. Loss
# ============================================================

criterion = DiceBCELoss()


# ============================================================
# 7. Optimizer
# ============================================================

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.0001
)


# ============================================================
# 8. Dice Score
# ============================================================

def dice_score(predictions, targets):

    predictions = torch.sigmoid(predictions)

    predictions = (predictions > 0.5).float()

    predictions = predictions.view(predictions.size(0), -1)
    targets = targets.view(targets.size(0), -1)

    intersection = (predictions * targets).sum(dim=1)

    dice = (
        (2 * intersection + 1.0)
        /
        (
            predictions.sum(dim=1)
            + targets.sum(dim=1)
            + 1.0
        )
    )

    return dice.mean().item()


# ============================================================
# 9. IoU Score
# ============================================================

def iou_score(predictions, targets):

    predictions = torch.sigmoid(predictions)

    predictions = (predictions > 0.5).float()

    predictions = predictions.view(predictions.size(0), -1)
    targets = targets.view(targets.size(0), -1)

    intersection = (predictions * targets).sum(dim=1)

    union = (
        predictions.sum(dim=1)
        + targets.sum(dim=1)
        - intersection
    )

    iou = (intersection + 1.0) / (union + 1.0)

    return iou.mean().item()


# ============================================================
# 10. Training
# ============================================================

epochs = 5

best_dice = 0.0


for epoch in range(epochs):

    # --------------------------------------------------------
    # Training mode
    # --------------------------------------------------------

    model.train()

    running_train_loss = 0.0

    for batch_index, (images, masks) in enumerate(train_loader):

        images = images.to(device)
        masks = masks.to(device)

        optimizer.zero_grad()

        predictions = model(images)

        loss = criterion(
            predictions,
            masks
        )

        loss.backward()

        optimizer.step()

        running_train_loss += loss.item()

        if (batch_index + 1) % 100 == 0:

            print(
                f"Training Batch "
                f"{batch_index + 1}/{len(train_loader)} "
                f"Loss: {loss.item():.4f}"
            )


    train_loss = (
        running_train_loss
        /
        len(train_loader)
    )


    # ========================================================
    # Validation
    # ========================================================

    model.eval()

    running_val_loss = 0.0
    running_dice = 0.0
    running_iou = 0.0

    with torch.no_grad():

        for images, masks in val_loader:

            images = images.to(device)
            masks = masks.to(device)

            predictions = model(images)

            loss = criterion(
                predictions,
                masks
            )

            running_val_loss += loss.item()

            running_dice += dice_score(
                predictions,
                masks
            )

            running_iou += iou_score(
                predictions,
                masks
            )


    val_loss = (
        running_val_loss
        /
        len(val_loader)
    )

    val_dice = (
        running_dice
        /
        len(val_loader)
    )

    val_iou = (
        running_iou
        /
        len(val_loader)
    )


    # ========================================================
    # Print results
    # ========================================================

    print()
    print("=" * 60)

    print(
        f"Epoch [{epoch + 1}/{epochs}]"
    )

    print(
        f"Train Loss : {train_loss:.4f}"
    )

    print(
        f"Val Loss   : {val_loss:.4f}"
    )

    print(
        f"Val Dice   : {val_dice:.4f}"
    )

    print(
        f"Val IoU    : {val_iou:.4f}"
    )

    print("=" * 60)


    # ========================================================
    # Save best model
    # ========================================================

    if val_dice > best_dice:

        best_dice = val_dice

        torch.save(
            model.state_dict(),
            "best_model.pth"
        )

        print("Best model saved.")


print()
print("Training completed.")