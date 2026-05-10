import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import plan, outfit, weather, assistant, explain, media, voice

app = FastAPI(title="妈妈的旅行小助手 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(plan.router,      prefix="/api/v1")
app.include_router(outfit.router,    prefix="/api/v1")
app.include_router(weather.router,   prefix="/api/v1")
app.include_router(assistant.router, prefix="/api/v1")
app.include_router(explain.router,   prefix="/api/v1")
app.include_router(media.router,     prefix="/api/v1")
app.include_router(voice.router,     prefix="/api/v1")

# Serve uploaded files
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/api/v1/health")
def health():
    return {"status": "ok", "model": os.getenv("GLM_MODEL", "GLM-5.1")}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
