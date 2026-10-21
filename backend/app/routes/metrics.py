import base64
import json
from io import BytesIO
from pathlib import Path

from fastapi import APIRouter, HTTPException
from PIL import Image
from tensorflow import keras

from app.services.prediction_service import MODEL_PATH, get_model, model_is_loaded


router = APIRouter()
HISTORY_PATH = Path(__file__).resolve().parents[2] / "training_history.json"


@router.get("/metrics")
def get_metrics() -> dict[str, object]:
    if not HISTORY_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail="Training metrics are unavailable. Run `python -m app.ml.train` from the backend directory.",
        )
    return json.loads(HISTORY_PATH.read_text(encoding="utf-8"))


@router.get("/model")
def get_model_info() -> dict[str, object]:
    layers = [
        {"name": "Input", "type": "Input", "shape": "28 x 28 grayscale"},
        {"name": "Flatten", "type": "Flatten", "shape": "784"},
        {"name": "Hidden 1", "type": "Dense + ReLU", "shape": "128"},
        {"name": "Hidden 2", "type": "Dense + ReLU", "shape": "64"},
        {"name": "Regularization", "type": "Dropout (0.2)", "shape": "64"},
        {"name": "Output", "type": "Dense + Softmax", "shape": "10 classes"},
    ]
    parameters = None
    if MODEL_PATH.exists():
        try:
            parameters = int(get_model().count_params())
        except Exception as error:
            raise HTTPException(status_code=503, detail=f"Trained model could not be loaded: {error}") from error
    return {
        "name": "MNIST Fully Connected ANN",
        "loaded": model_is_loaded(),
        "parameters": parameters,
        "layers": layers,
    }


@router.get("/dataset/samples")
def get_dataset_samples(limit: int = 12) -> dict[str, object]:
    if not 1 <= limit <= 30:
        raise HTTPException(status_code=422, detail="Limit must be between 1 and 30.")
    try:
        (images, labels), _ = keras.datasets.mnist.load_data()
    except Exception as error:
        raise HTTPException(status_code=503, detail=f"MNIST dataset unavailable: {error}") from error

    samples = []
    for index in range(limit):
        output = BytesIO()
        Image.fromarray(images[index]).save(output, format="PNG")
        encoded = base64.b64encode(output.getvalue()).decode("ascii")
        samples.append({"label": int(labels[index]), "image": f"data:image/png;base64,{encoded}"})
    return {"samples": samples, "source": "MNIST training split"}