# AquaGuard AI — Machine Learning Pipeline

Machine learning model training, probability calibration, explainability (SHAP), and artifact serialization for the 9 physicochemical water quality indicators.

## Features
- **Algorithm:** Calibrated HistGradientBoostingClassifier with 5-fold Sigmoid Platt Scaling.
- **Explainability:** Local feature attribution engine generating marginal contribution values for all 9 parameters.
- **Evaluation:** Evaluates Accuracy, Precision, Recall, F1, ROC-AUC, Brier score, and generates ROC, PR, and Calibration curve points.
- **Artifacts:** Exports model weights, median imputer, and metrics manifest directly consumed by the backend service.

## Directory Structure
- `data/processed/`: Standardized environmental benchmark dataset (`water_potability.csv`).
- `src/`:
  - `train.py`: Pipeline for dataset generation, model cross-validation, probability calibration, and artifact export.
  - `predict.py`: Inference class (`WaterQualityPredictor`) loaded by the backend API.
- `artifacts/`:
  - `model_pipeline.joblib`: Serialized calibrated model, imputer, and feature baseline weights.
  - `metrics.json`: Serialized evaluation metrics, benchmark comparison tables, confusion matrix, and curve coordinates.

## How to Retrain the Model
```bash
python ml/src/train.py
```
