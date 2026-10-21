from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.prediction_service import predict


router = APIRouter()


@router.post("/predict")
async def predict_digit(image: UploadFile = File(...)) -> dict[str, object]:
    if image.content_type not in {"image/png", "image/jpeg", "image/webp"}:
        raise HTTPException(status_code=415, detail="Upload a PNG, JPEG, or WebP image.")
    content = await image.read()
    if not content or len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be non-empty and smaller than 5 MB.")
    try:
        return predict(content)
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error