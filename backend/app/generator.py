from pathlib import Path
from uuid import uuid4

import torch
from diffusers import AutoPipelineForText2Image


MODEL_ID = "stabilityai/sdxl-turbo"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

_pipe = None


def get_pipeline():
    global _pipe
    if _pipe is None:
        if not torch.cuda.is_available():
            raise RuntimeError("CUDA tidak tersedia. GPU tidak terdeteksi.")
        _pipe = AutoPipelineForText2Image.from_pretrained(
            MODEL_ID,
            torch_dtype=torch.float16,
            variant="fp16",
        )
        _pipe.enable_model_cpu_offload()
    return _pipe


def generate_image(prompt: str, steps: int = 2, width: int = 512, height: int = 512):
    pipe = get_pipeline()
    image = pipe(
        prompt=prompt,
        num_inference_steps=steps,
        guidance_scale=0.0,
        width=width,
        height=height,
    ).images[0]

    filename = f"{uuid4().hex}.png"
    output_path = OUTPUT_DIR / filename
    image.save(output_path)
    return filename, output_path