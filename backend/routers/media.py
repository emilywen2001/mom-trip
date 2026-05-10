import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
import aiofiles

router = APIRouter(prefix="/media", tags=["media"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    tripId: str = Form(""),
    mediaType: str = Form("photo"),
    latitude: float = Form(0.0),
    longitude: float = Form(0.0),
    voiceNote: str = Form(""),
):
    ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    async with aiofiles.open(filepath, "wb") as f:
        content = await file.read()
        await f.write(content)

    file_url = f"/uploads/{filename}"

    return {
        "code": 0,
        "msg": "success",
        "data": {
            "id": f"m_{uuid.uuid4().hex[:8]}",
            "fileUrl": file_url,
            "thumbUrl": file_url,
            "placeName": "识别中…",
            "takenAt": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        },
    }


@router.get("/trip/{trip_id}")
async def get_trip_media(trip_id: str):
    # Demo: return mock data
    return {
        "code": 0,
        "msg": "success",
        "data": {
            "photos": [],
            "videos": [],
            "totalCount": 0,
        },
    }
