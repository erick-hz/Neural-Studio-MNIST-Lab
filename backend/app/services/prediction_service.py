from functools import lru_cache
from pathlib import Path

import numpy as np
from tensorflow import keras

from app.ml.preprocess import image_to_tensor


MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "neural_network.keras"


@lru_cache(maxsize=1)
def get_model() -> keras.Model:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Trained model not found. Run `python -m app.ml.train` from the backend directory first."
        )
    return keras.models.load_model(MODEL_PATH)


def model_is_loaded() -> bool:
    return get_model.cache_info().currsize > 0 and MODEL_PATH.exists()


def predict(image_bytes: bytes) -> dict[str, object]:
    tensor = image_to_tensor(image_bytes)
    probabilities = get_model().predict(tensor, verbose=0)[0]
    prediction = int(np.argmax(probabilities))
    return {
        "prediction": prediction,
        "confidence": float(probabilities[prediction]),
        "probabilities": [float(value) for value in probabilities],
    }