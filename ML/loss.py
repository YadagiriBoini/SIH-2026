import torch
import torch.nn as nn


# ============================================================
# Dice Loss
# ============================================================

class DiceLoss(nn.Module):

    def __init__(self, smooth=1.0):

        super().__init__()

        self.smooth = smooth

    def forward(self, predictions, targets):

        # Convert logits → probabilities
        predictions = torch.sigmoid(predictions)

        # Flatten everything except batch dimension
        predictions = predictions.view(
            predictions.size(0),
            -1
        )

        targets = targets.view(
            targets.size(0),
            -1
        )

        # Intersection
        intersection = (
            predictions * targets
        ).sum(dim=1)

        # Dice coefficient
        dice = (
            (2 * intersection + self.smooth)
            /
            (
                predictions.sum(dim=1)
                +
                targets.sum(dim=1)
                +
                self.smooth
            )
        )

        # Dice loss
        loss = 1 - dice

        return loss.mean()


# ============================================================
# Combined Dice + BCE Loss
# ============================================================

class DiceBCELoss(nn.Module):

    def __init__(self):

        super().__init__()

        self.dice = DiceLoss()

        self.bce = nn.BCEWithLogitsLoss()

    def forward(self, predictions, targets):

        dice_loss = self.dice(
            predictions,
            targets
        )

        bce_loss = self.bce(
            predictions,
            targets
        )

        total_loss = (
            dice_loss +
            bce_loss
        )

        return total_loss