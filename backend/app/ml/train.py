import json
from datetime import datetime
from pathlib import Path

from tensorflow import keras

from app.ml.model import build_model


ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = ROOT / "models" / "neural_network.keras"
HISTORY_PATH = ROOT / "training_history.json"


def train() -> None:
    (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()
    x_train = x_train.astype("float32") / 255.0
    x_test = x_test.astype("float32") / 255.0

    model = build_model()
    history = model.fit(
        x_train,
        y_train,
        epochs=10,
        batch_size=32,
        validation_split=0.2,
        verbose=2,
    )
    test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    model.save(MODEL_PATH)
    metrics = {
        "accuracy": [float(value) for value in history.history["accuracy"]],
        "val_accuracy": [float(value) for value in history.history["val_accuracy"]],
        "loss": [float(value) for value in history.history["loss"]],
        "val_loss": [float(value) for value in history.history["val_loss"]],
        "test_accuracy": float(test_accuracy),
        "test_loss": float(test_loss),
        "epochs": len(history.epoch),
        "training_images": int(len(x_train)),
        "testing_images": int(len(x_test)),
        "batch_size": 32,
        "validation_split": 0.2,
        "trained_at": datetime.now().astimezone().isoformat(),
    }
    HISTORY_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Saved trained model to {MODEL_PATH}")
    print(f"MNIST test accuracy: {test_accuracy:.4%}")


if __name__ == "__main__":
    train()