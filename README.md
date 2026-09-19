# SIH-2026
# 🛰️ Satellite Oil Spill Attribution

An AI-powered prototype for **oil spill detection, segmentation, vessel analysis, and explainable attribution** using satellite SAR imagery, U-Net, AIS vessel data, XGBoost, and SHAP.

The system is designed to move beyond simply detecting an oil spill by combining satellite observations with nearby vessel information and explainable machine learning.

---

## 🚀 Project Overview

Oil spills are difficult to monitor because detecting a suspected spill is only the first step. After detection, it is useful to determine:

1. **Where is the suspected oil spill?**
2. **What is the estimated spill area?**
3. **Which vessels are located near the observation?**
4. **What vessel-related factors contribute to an attribution score?**

Our system combines:

- 🛰️ **NISAR SAR satellite data**
- 🧠 **U-Net segmentation**
- 🚢 **AIS vessel data**
- 🤖 **XGBoost attribution model**
- 🔍 **SHAP explainability**
- ⚡ **FastAPI backend**
- ⚛️ **React frontend**

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │   NISAR SAR Data    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ NISAR Preprocessing │
                    │                     │
                    │ • Channel extraction│
                    │ • dB conversion     │
                    │ • Normalization     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       U-Net         │
                    │                     │
                    │ Oil Spill           │
                    │ Segmentation        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Predicted Spill     │
                    │ Mask                │
                    │                     │
                    │ • Spill pixels      │
                    │ • Spill percentage  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    AIS Vessel Data │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Vessel Features     │
                    │                     │
                    │ • Distance          │
                    │ • Speed             │
                    │ • Course            │
                    │ • Vessel type       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      XGBoost        │
                    │ Attribution Model   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Attribution Score   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       SHAP          │
                    │ Explainability      │
                    └─────────────────────┘
