import base64
from fastapi import APIRouter, UploadFile, File, Form
from services.llm_service import vision_chat, chat_json, EXPLAIN_SYSTEM

router = APIRouter(prefix="/explain", tags=["explain"])


@router.post("/by-image")
async def explain_by_image(
    image: UploadFile = File(...),
    location: str = Form(""),
):
    try:
        data = await image.read()
        b64 = base64.b64encode(data).decode()
        media_type = image.content_type or "image/jpeg"

        text = f"请识别并讲解图片中的景点。位置参考：{location or '未知'}"
        raw = vision_chat(EXPLAIN_SYSTEM, b64, media_type, text)

        # parse JSON from response
        import json
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())
        return {"code": 0, "msg": "success", "data": result}
    except Exception as e:
        return {"code": 1004, "msg": str(e), "data": None}
