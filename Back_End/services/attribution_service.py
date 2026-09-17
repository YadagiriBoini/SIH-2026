import numpy as np
import shap

from xgboost import XGBClassifier


# ============================================================
# FEATURE NAMES
# ============================================================

FEATURE_NAMES = [
    "distance_km",
    "speed",
    "course",
    "is_tanker"
]


# ============================================================
# FEATURE EXTRACTION
# ============================================================

def create_features(vessel):

    distance = vessel.get(
        "distance_km",
        999
    )

    speed = vessel.get(
        "speed",
        0
    )

    course = vessel.get(
        "course",
        0
    )

    vessel_type = vessel.get(
        "type",
        "Unknown"
    )

    is_tanker = (
        1
        if vessel_type.lower() == "tanker"
        else 0
    )

    return [
        distance,
        speed,
        course,
        is_tanker
    ]


# ============================================================
# DEMO TRAINING DATA
# ============================================================

def create_demo_training_data():

    X = np.array([

        [2, 10, 120, 1],
        [4, 12, 135, 1],
        [8, 14, 150, 1],
        [15, 11, 180, 1],

        [2, 10, 120, 0],
        [5, 15, 200, 0],
        [12, 8, 220, 0],
        [25, 12, 300, 0],

        [3, 18, 90, 1],
        [6, 20, 100, 1],
        [20, 5, 250, 1],

        [7, 9, 130, 0],
        [18, 14, 160, 0],
        [30, 10, 270, 0]

    ], dtype=np.float32)

    y = np.array([
        1, 1, 1, 1,
        0, 0, 0, 0,
        1, 1, 0,
        0, 0, 0
    ])

    return X, y


# ============================================================
# TRAIN MODEL
# ============================================================

def train_attribution_model():

    X, y = create_demo_training_data()

    model = XGBClassifier(
        n_estimators=100,
        max_depth=3,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="logloss",
        random_state=42
    )

    model.fit(X, y)

    return model


# ============================================================
# SHAP EXPLANATION
# ============================================================

def explain_vessel(model, features):

    feature_array = np.array(
        [features],
        dtype=np.float32
    )

    explainer = shap.TreeExplainer(
        model
    )

    shap_values = explainer.shap_values(
        feature_array
    )

    # SHAP value for this vessel
    values = shap_values[0]

    explanation = {}

    for name, value in zip(
        FEATURE_NAMES,
        values
    ):

        explanation[name] = round(
            float(value),
            6
        )

    return explanation


# ============================================================
# ATTRIBUTE VESSELS
# ============================================================

def attribute_vessels(vessels):

    if not vessels:

        return []

    model = train_attribution_model()

    features = np.array(
        [
            create_features(vessel)
            for vessel in vessels
        ],
        dtype=np.float32
    )

    probabilities = model.predict_proba(
        features
    )[:, 1]

    results = []

    for vessel, probability, feature_row in zip(
        vessels,
        probabilities,
        features
    ):

        result = vessel.copy()

        result["attribution_score"] = round(
            float(probability),
            4
        )

        # SHAP explanation
        result["shap_explanation"] = (
            explain_vessel(
                model,
                feature_row
            )
        )

        results.append(result)

    results.sort(
        key=lambda x:
            x["attribution_score"],
        reverse=True
    )

    return results