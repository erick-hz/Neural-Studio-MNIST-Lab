import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.metrics import router as metrics_router
from app.routes.predict import router as predict_router
from app.services.prediction_service import MODEL_PATH, get_model


app = FastAPI(
    title="Neural Studio API",
    description="MNIST handwritten digit recognition and training metrics.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "API_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(predict_router, prefix="/api", tags=["Prediction"])
app.include_router(metrics_router, prefix="/api", tags=["Model and dataset"])


@app.get("/api/health", tags=["Health"])
def health() -> dict[str, object]:
    loaded = False
    if MODEL_PATH.exists():
        try:
            get_model()
            loaded = True
        except Exception:
            loaded = False
    return {"status": "ok", "model_loaded": loaded}