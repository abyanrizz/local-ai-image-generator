from pathlib import Path

import torch
from diffusers import AutoPipelineForText2Image


MODEL_ID = "stabilityai/sdxl-turbo"

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("Loading SDXL-Turbo...")
print(f"PyTorch: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")

if not torch.cuda.is_available():
    raise RuntimeError("CUDA tidak tersedia. Generation dibatalkan.")

print(f"GPU: {torch.cuda.get_device_name(0)}")

pipe = AutoPipelineForText2Image.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.float16,
    variant="fp16",
)

# Lebih aman untuk RTX 5070 12 GB pada pengujian pertama.
# Model dipindahkan ke GPU saat komponennya diperlukan.
pipe.enable_model_cpu_offload()

prompt = (
    "a futuristic cyberpunk cat sitting in front of a computer, "
    "cinematic lighting, highly detailed, professional photography"
)

print("Generating image...")

image = pipe(
    prompt=prompt,
    num_inference_steps=2,
    guidance_scale=0.0,
    height=512,
    width=512,
).images[0]

output_path = OUTPUT_DIR / "test_output.png"
image.save(output_path)

print(f"SUCCESS!")
print(f"Image saved to: {output_path}")