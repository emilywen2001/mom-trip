import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.llm_service import stream_chat, ASSISTANT_SYSTEM

router = APIRouter(prefix="/assistant", tags=["assistant"])


class Context(BaseModel):
    currentLocation: dict | None = None
    currentCity: str | None = None
    tripId: str | None = None
    currentDay: int | None = None


class HistoryItem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    context: Context | None = None
    history: list[HistoryItem] = []


@router.post("/chat")
async def chat(req: ChatRequest):
    ctx = req.context or Context()
    system = ASSISTANT_SYSTEM
    if ctx.currentCity:
        system += f"\n当前城市：{ctx.currentCity}"
    if ctx.currentDay:
        system += f"\n旅行第{ctx.currentDay}天"

    history = [{"role": h.role, "content": h.content} for h in req.history]

    def event_stream():
        full = ""
        try:
            for delta in stream_chat(system, history, req.message):
                full += delta
                yield f"data: {json.dumps({'delta': delta}, ensure_ascii=False)}\n\n"
            yield f"data: {json.dumps({'done': True, 'fullText': full}, ensure_ascii=False)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'delta': '抱歉，我遇到了一些问题，请稍后再试 😊'})}\n\n"
            yield f"data: {json.dumps({'done': True, 'fullText': ''})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
