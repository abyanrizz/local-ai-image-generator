# Local AI Image Generator

A local AI image generation web application where the frontend runs on a lightweight client device while the AI inference workload is processed remotely by a dedicated NVIDIA GPU machine.

The project uses a MacBook as the frontend development/client machine and a Windows PC equipped with an NVIDIA RTX GPU as the AI inference server.

## Architecture

```text
┌─────────────────────┐
│      MacBook        │
│                     │
│ React + Vite        │
│ Web Interface       │
└──────────┬──────────┘
           │
           │ HTTP API
           ▼
┌─────────────────────┐
│     Windows PC      │
│                     │
│ FastAPI Backend     │
│ PyTorch             │
│ Hugging Face        │
│ Diffusers           │
└──────────┬──────────┘
           │
           │ CUDA
           ▼
┌─────────────────────┐
│ NVIDIA RTX GPU      │
│                     │
│ SDXL Turbo          │
│ Image Inference     │
└─────────────────────┘
```

## Features

- AI text-to-image generation
- SDXL Turbo inference
- NVIDIA CUDA acceleration
- React + Vite web interface
- FastAPI REST API
- Adjustable inference steps
- Multiple image resolutions
- Image preview
- Local network client/server architecture
- GPU workload separated from the frontend device

## Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- Python
- FastAPI
- Uvicorn
- PyTorch
- Hugging Face Diffusers
- Transformers
- Accelerate

### AI Model

- Stability AI SDXL Turbo

### Hardware

The inference server used during development:

- AMD Ryzen 7 7700
- NVIDIA GeForce RTX 5070
- 32 GB DDR5 RAM
- Windows

The frontend/client development machine:

- Apple A18 Pro (Macbook Neo)
- macOS

## Project Structure

```text
local-ai-image-generator/
├── backend/
│   ├── app/
│   │   ├── generator.py
│   │   ├── main.py
│   │   └── test_generate.py
│   ├── outputs/
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Backend Setup

Clone the repository:

```bash
git clone https://github.com/abyanrizz/local-ai-image-generator.git
cd local-ai-image-generator/backend
```

Create a Python virtual environment:

### Windows

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

Run the backend:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

FastAPI documentation will be available at:

```text
http://localhost:8000/docs
```

## Frontend Setup

Go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment configuration:

```bash
cp .env.example .env
```

Set the backend server address inside `.env`:

```env
VITE_API_BASE_URL=http://YOUR_BACKEND_IP:8000
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## API

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

### Generate Image

```http
POST /generate
```

Example request:

```json
{
  "prompt": "a futuristic city at night, cinematic lighting",
  "steps": 2,
  "width": 512,
  "height": 512
}
```

Example response:

```json
{
  "message": "success",
  "filename": "generated-image.png",
  "image_url": "/outputs/generated-image.png"
}
```

## How It Works

1. The user enters a prompt in the React interface.
2. The frontend sends a request to the FastAPI backend.
3. FastAPI forwards the generation request to the SDXL Turbo pipeline.
4. PyTorch executes the inference workload using the NVIDIA GPU.
5. The generated image is saved by the backend.
6. The resulting image URL is returned to the frontend.
7. The generated image is displayed in the browser.

## Development Status

Current MVP:

- [x] CUDA GPU inference
- [x] SDXL Turbo integration
- [x] FastAPI backend
- [x] React frontend
- [x] LAN client/server communication
- [x] Generated image preview
- [ ] Public inference endpoint
- [ ] Request queue
- [ ] Rate limiting
- [ ] Generation history
- [ ] Multiple AI models
- [ ] Production deployment

## Security Note

The `.env` file, virtual environments, generated images, and other local configuration files are excluded from Git using `.gitignore`.

Do not expose the inference backend directly to the public internet without authentication, rate limiting, and appropriate security controls.

## License

This project is currently intended for learning, experimentation, and portfolio purposes.
