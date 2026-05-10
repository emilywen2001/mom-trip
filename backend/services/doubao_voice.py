"""
豆包语音封装（火山引擎 v3 协议）：
- transcribe(audio_bytes, fmt): 录音文件识别 2.0（submit + poll）
- synthesize(text): SeedTTS 2.0 单向流式

鉴权统一用 X-Api-App-Key + X-Api-Access-Key + X-Api-Resource-Id 三件套。
不要让前端直接调豆包；密钥只在本服务读取。
"""

import asyncio
import base64
import os
import uuid
from typing import Optional

import httpx

ASR_SUBMIT_URL = "https://openspeech.bytedance.com/api/v3/auc/bigmodel/submit"
ASR_QUERY_URL = "https://openspeech.bytedance.com/api/v3/auc/bigmodel/query"
TTS_URL = "https://openspeech.bytedance.com/api/v3/tts/unidirectional"


def _env(key: str, default: Optional[str] = None) -> str:
    v = os.getenv(key, default)
    if not v:
        raise RuntimeError(f"missing env: {key}")
    return v


def _headers(resource_id: str, request_id: str) -> dict[str, str]:
    return {
        "X-Api-App-Key": _env("DOUBAO_APP_ID"),
        "X-Api-Access-Key": _env("DOUBAO_ACCESS_TOKEN"),
        "X-Api-Resource-Id": resource_id,
        "X-Api-Request-Id": request_id,
        "X-Api-Sequence": "-1",
        "Content-Type": "application/json",
    }


async def transcribe(audio_bytes: bytes, fmt: str = "wav") -> str:
    """提交录音 → 轮询 → 返回最终识别文本。"""
    resource_id = _env("DOUBAO_ASR_RESOURCE_ID")
    request_id = str(uuid.uuid4())
    submit_body = {
        "user": {"uid": "mom-trip-user"},
        "audio": {
            "data": base64.b64encode(audio_bytes).decode("ascii"),
            "format": fmt,
        },
        "request": {
            "model_name": os.getenv("DOUBAO_ASR_MODEL", "bigmodel"),
            "enable_itn": True,
            "enable_punc": True,
            "enable_ddc": False,
        },
    }

    async with httpx.AsyncClient(timeout=60) as client:
        submit = await client.post(ASR_SUBMIT_URL, json=submit_body, headers=_headers(resource_id, request_id))
        status = submit.headers.get("X-Api-Status-Code")
        if status not in (None, "20000000", "20000001"):
            body = submit.text
            raise RuntimeError(f"asr submit failed: {status} {submit.headers.get('X-Api-Message')} body={body[:200]}")

        for _ in range(30):
            await asyncio.sleep(1)
            query = await client.post(ASR_QUERY_URL, json={}, headers=_headers(resource_id, request_id))
            qstatus = query.headers.get("X-Api-Status-Code")
            if qstatus == "20000000":
                payload = query.json()
                result = payload.get("result") or {}
                if isinstance(result, dict):
                    text = result.get("text")
                    if text:
                        return text
                    utterances = result.get("utterances") or []
                    return "".join(u.get("text", "") for u in utterances).strip()
                return ""
            if qstatus and qstatus.startswith("45"):
                continue
            raise RuntimeError(f"asr query failed: {qstatus} {query.headers.get('X-Api-Message')}")

    raise RuntimeError("asr query timeout")


async def synthesize(text: str) -> bytes:
    """文本 → mp3 字节（v3 unidirectional 流式响应拼接）。"""
    resource_id = _env("DOUBAO_TTS_RESOURCE_ID")
    request_id = str(uuid.uuid4())
    speed_pct = int((float(os.getenv("DOUBAO_TTS_SPEED", "0.95")) - 1.0) * 100)
    body = {
        "user": {"uid": "mom-trip-user"},
        "req_params": {
            "text": text,
            "speaker": os.getenv("DOUBAO_TTS_VOICE", "zh_female_qingxin"),
            "audio_params": {
                "format": "mp3",
                "sample_rate": 24000,
                "speech_rate": speed_pct,
            },
        },
    }

    async with httpx.AsyncClient(timeout=30) as client:
        async with client.stream(
            "POST", TTS_URL, json=body, headers=_headers(resource_id, request_id)
        ) as resp:
            status = resp.headers.get("X-Api-Status-Code")
            if status not in (None, "20000000"):
                detail = (await resp.aread()).decode("utf-8", "ignore")
                raise RuntimeError(f"tts failed: {status} {resp.headers.get('X-Api-Message')} body={detail[:200]}")
            audio = bytearray()
            async for line in resp.aiter_lines():
                if not line:
                    continue
                if line.startswith("data:"):
                    line = line[5:].strip()
                # 服务端可能直接返回 base64 字符串行；JSON 行里的 data 字段也是 base64
                try:
                    import json as _json
                    msg = _json.loads(line)
                    chunk = msg.get("audio") or msg.get("data")
                    if chunk:
                        audio.extend(base64.b64decode(chunk))
                except Exception:
                    try:
                        audio.extend(base64.b64decode(line))
                    except Exception:
                        pass
            if not audio:
                raise RuntimeError("tts empty audio")
            return bytes(audio)
