from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel

from services.doubao_voice import synthesize, transcribe

router = APIRouter(prefix="/voice", tags=["voice"])


_FORMAT_BY_CT = {
    "audio/webm": "webm",
    "audio/ogg": "ogg",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/mp4": "m4a",
    "audio/aac": "aac",
}


@router.post("/asr")
async def asr(audio: UploadFile = File(...)):
    raw = await audio.read()
    if not raw:
        raise HTTPException(status_code=400, detail="empty audio")
    fmt = _FORMAT_BY_CT.get((audio.content_type or "").lower(), "webm")
    try:
        text = await transcribe(raw, fmt=fmt)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"asr failed: {e}") from e
    return {"text": text}


class TTSRequest(BaseModel):
    text: str


@router.post("/tts")
async def tts(req: TTSRequest):
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="empty text")
    try:
        audio_bytes = await synthesize(text)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"tts failed: {e}") from e
    return Response(content=audio_bytes, media_type="audio/mpeg")
