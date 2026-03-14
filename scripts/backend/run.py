from app.main import app
import os

if __name__ == "__main__":
    import uvicorn
    # allow port override via env var to avoid conflicts when multiple backends run
    port = int(os.getenv("BACKEND_PORT", "8002"))
    uvicorn.run(app, host="127.0.0.1", port=port)