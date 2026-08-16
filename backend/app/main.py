from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from app.generator import generate_image

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "outputs"

app = FastAPI(title="Local AI Image Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")


class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    steps: int = 2
    width: int = 512
    height: int = 512


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate")
def generate(data: GenerateRequest):
    filename, output_path = generate_image(
        prompt=data.prompt,
        steps=data.steps,
        width=data.width,
        height=data.height,
    )
    return {
        "message": "success",
        "filename": filename,
        "image_url": f"/outputs/{filename}",
        "image_path": str(output_path),
    }