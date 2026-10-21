from io import BytesIO

import numpy as np
from PIL import Image, ImageOps


def image_to_tensor(image_bytes: bytes) -> np.ndarray:
    """Convert a black-background drawing into a normalized MNIST-like tensor."""
    try:
        image = Image.open(BytesIO(image_bytes)).convert("L")
    except Exception as error:
        raise ValueError("The uploaded file is not a readable image.") from error

    image = ImageOps.autocontrast(image)
    pixels = np.asarray(image)
    foreground = pixels > 24
    if not foreground.any():
        raise ValueError("Draw a digit before requesting a prediction.")

    rows, columns = np.where(foreground)
    cropped = image.crop(
        (int(columns.min()), int(rows.min()), int(columns.max()) + 1, int(rows.max()) + 1)
    )
    width, height = cropped.size
    scale = 20 / max(width, height)
    resized = cropped.resize(
        (max(1, round(width * scale)), max(1, round(height * scale))),
        Image.Resampling.LANCZOS,
    )

    canvas = Image.new("L", (28, 28), color=0)
    offset = ((28 - resized.width) // 2, (28 - resized.height) // 2)
    canvas.paste(resized, offset)
    tensor = np.asarray(canvas, dtype=np.float32) / 255.0
    return tensor[np.newaxis, ...]