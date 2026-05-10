from fastapi import APIRouter
from pydantic import BaseModel
from services.llm_service import chat_json, OUTFIT_SYSTEM

router = APIRouter(prefix="/outfit", tags=["outfit"])


class WeatherIn(BaseModel):
    condition: str
    tempHigh: int
    tempLow: int


class OutfitRequest(BaseModel):
    tripId: str
    dayIndex: int
    destination: str
    date: str
    weather: WeatherIn
    dayActivities: list[str] = []
    groupType: str = "sisters"


def ok(data):
    return {"code": 0, "msg": "success", "data": data}


@router.post("/suggest")
async def suggest_outfit(req: OutfitRequest):
    group_label = {"sisters": "姐妹团", "family": "家人", "solo": "独自", "couple": "夫妻"}.get(req.groupType, req.groupType)
    user_msg = f"""
目的地：{req.destination}
天气：{req.weather.condition}，最高{req.weather.tempHigh}°C，最低{req.weather.tempLow}°C
今日活动：{', '.join(req.dayActivities) if req.dayActivities else '观光游览'}
出行类型：{group_label}

请给出穿搭建议，返回JSON（只返回JSON，不要其他文字）：
{{
  "theme": "莫兰迪xxx",
  "colorHex": "#xxxxxx",
  "emojiIcons": ["👗", "👒", "👟"],
  "description": "描述（含适合姐妹同色系的建议）",
  "photoTip": "具体的拍照构图小提示",
  "items": [
    {{"category": "上衣", "suggestion": "具体单品建议"}},
    {{"category": "下装", "suggestion": "xxx"}},
    {{"category": "鞋子", "suggestion": "xxx"}},
    {{"category": "配件", "suggestion": "xxx"}}
  ]
}}
"""
    try:
        data = chat_json(OUTFIT_SYSTEM, user_msg)
        return ok(data)
    except Exception as e:
        return {"code": 1004, "msg": str(e), "data": None}
