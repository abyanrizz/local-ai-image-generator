import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [prompt, setPrompt] = useState("");
  const [steps, setSteps] = useState(2);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Prompt tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE}/generate`, {
        prompt,
        steps: Number(steps),
        width: Number(width),
        height: Number(height),
      });

      setImageUrl(`${API_BASE}${response.data.image_url}`);
    } catch (err) {
      console.error(err);
      setError("Gagal generate image. Pastikan backend PC sedang aktif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <h1>Abyan AI</h1>
            <span>Local Image Generator</span>
          </div>
        </div>

        <div className="model-badge">
          <span className="status-dot"></span>
          SDXL Turbo
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">LOCAL GENERATIVE AI</span>

          <h2>
            Turn your ideas into
            <span> images.</span>
          </h2>

          <p>
            Generate AI images locally using your own NVIDIA GPU.
            Your MacBook handles the interface while your PC handles inference.
          </p>
        </div>
      </section>

      <section className="workspace">
        <form className="control-panel" onSubmit={handleGenerate}>
          <div className="panel-header">
            <div>
              <p className="section-label">CREATE</p>
              <h3>Image settings</h3>
            </div>
          </div>

          <div className="field">
            <label htmlFor="prompt">Prompt</label>

            <textarea
              id="prompt"
              rows="7"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Describe the image you want to create..."
            />

            <div className="prompt-footer">
              <span>Be descriptive for better results</span>
              <span>{prompt.length} characters</span>
            </div>
          </div>

          <div className="settings-grid">
            <div className="field">
              <label htmlFor="steps">Inference steps</label>

              <select
                id="steps"
                value={steps}
                onChange={(event) => setSteps(event.target.value)}
              >
                <option value="1">1 step</option>
                <option value="2">2 steps</option>
                <option value="3">3 steps</option>
                <option value="4">4 steps</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="resolution">Resolution</label>

              <select
                id="resolution"
                value={`${width}x${height}`}
                onChange={(event) => {
                  const [newWidth, newHeight] = event.target.value.split("x");

                  setWidth(Number(newWidth));
                  setHeight(Number(newHeight));
                }}
              >
                <option value="512x512">512 × 512</option>
                <option value="768x512">768 × 512</option>
                <option value="512x768">512 × 768</option>
                <option value="768x768">768 × 768</option>
              </select>
            </div>
          </div>

          <button className="generate-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating image...
              </>
            ) : (
              <>
                <span>✦</span>
                Generate Image
              </>
            )}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="preview-panel">
          <div className="preview-header">
            <div>
              <p className="section-label">PREVIEW</p>
              <h3>Generated image</h3>
            </div>

            {imageUrl && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="open-image"
              >
                Open image ↗
              </a>
            )}
          </div>

          <div className="image-stage">
            {loading && (
              <div className="empty-state">
                <div className="loading-orb"></div>
                <h4>Creating your image</h4>
                <p>Your RTX GPU is working on it...</p>
              </div>
            )}

            {!loading && !imageUrl && (
              <div className="empty-state">
                <div className="empty-icon">✦</div>
                <h4>Your image will appear here</h4>
                <p>Write a prompt and press Generate Image.</p>
              </div>
            )}

            {!loading && imageUrl && (
              <img
                className="generated-image"
                src={imageUrl}
                alt={prompt || "AI generated"}
              />
            )}
          </div>

          {imageUrl && (
            <div className="image-meta">
              <span>{width} × {height}</span>
              <span>{steps} inference steps</span>
              <span>SDXL Turbo</span>
            </div>
          )}
        </div>
      </section>

      <footer>
        <p>
          Powered locally by <strong>FastAPI</strong>,{" "}
          <strong>PyTorch</strong> and <strong>SDXL Turbo</strong>
        </p>
      </footer>
    </main>
  );
}

export default App;