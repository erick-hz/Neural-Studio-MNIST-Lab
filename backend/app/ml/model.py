from tensorflow import keras


def build_model() -> keras.Model:
    model = keras.Sequential(
        [
            keras.layers.Input(shape=(28, 28), name="image"),
            keras.layers.Flatten(name="flatten"),
            keras.layers.Dense(128, activation="relu", name="dense_128"),
            keras.layers.Dense(64, activation="relu", name="dense_64"),
            keras.layers.Dropout(0.2, name="dropout"),
            keras.layers.Dense(10, activation="softmax", name="probabilities"),
        ],
        name="mnist_ann",
    )
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model