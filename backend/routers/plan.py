from fastapi import APIRouter
from pydantic import BaseModel
from services.llm_service import chat_json, PLAN_SYSTEM, PARSE_SYSTEM
import uuid, json

router = APIRouter(prefix="/plan", tags=["plan"])


class PlanRequest(BaseModel):
    destination: str
    days: int
    groupType: str = "sisters"
    memberCount: int = 4
    preferences: list[str] = []


class ParseRequest(BaseModel):
    content: str
    contentType: str = "text"


def ok(data):
    return {"code": 0, "msg": "success", "data": data}


def err(msg):
    return {"code": 1004, "msg": msg, "data": None}


@router.post("/generate")
async def generate_plan(req: PlanRequest):
    group_label = {"sisters": "姐妹团", "family": "家人", "solo": "独自", "couple": "夫妻"}.get(req.groupType, req.groupType)
    user_msg = f"""
请为以下旅行规划完整行程并返回JSON：
目的地：{req.destination}
天数：{req.days}天
出行类型：{group_label}
人数：{req.memberCount}人
偏好：{', '.join(req.preferences) if req.preferences else '轻松舒适'}

返回格式：
{{
  "tripTitle": "标题",
  "itineraries": [
    {{
      "dayIndex": 1,
      "date": "2025-05-12",
      "theme": "今日主题",
      "items": [
        {{
          "id": "i_1",
          "time": "09:00",
          "title": "景点名称",
          "description": "详细描述",
          "type": "attraction",
          "address": "地址",
          "latitude": 0.0,
          "longitude": 0.0,
          "isBooked": false,
          "tags": ["轻松游"]
        }}
      ]
    }}
  ]
}}
"""
    try:
        data = chat_json(PLAN_SYSTEM, user_msg, max_tokens=3000)
        # ensure IDs exist
        for day in data.get("itineraries", []):
            day.setdefault("id", f"d_{day.get('dayIndex', 0)}")
            for item in day.get("items", []):
                item.setdefault("id", str(uuid.uuid4())[:8])
                item.setdefault("isBooked", False)
                item.setdefault("tags", [])
        return ok(data)
    except Exception as e:
        return err(f"AI 规划失败：{str(e)}")


@router.post("/parse-link")
async def parse_link(req: ParseRequest):
    try:
        data = chat_json(PARSE_SYSTEM, f"攻略内容：{req.content}", max_tokens=1000)
        return ok(data)
    except Exception as e:
        return err(f"解析失败：{str(e)}")
