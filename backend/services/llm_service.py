import os
import json
from anthropic import Anthropic

_client: Anthropic | None = None

def get_client() -> Anthropic:
    global _client
    if _client is None:
        _client = Anthropic(
            api_key=os.getenv("GLM_API_KEY"),
            base_url=os.getenv("GLM_BASE_URL", "https://open.bigmodel.cn/api/anthropic"),
        )
    return _client

MODEL = os.getenv("GLM_MODEL", "GLM-5.1")


def chat(system: str, user_msg: str, max_tokens: int = 2000) -> str:
    resp = get_client().messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user_msg}],
    )
    return resp.content[0].text


def chat_json(system: str, user_msg: str, max_tokens: int = 2000) -> dict:
    text = chat(system, user_msg, max_tokens)
    # strip markdown code blocks if present
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()
    return json.loads(text)


def stream_chat(system: str, history: list, user_msg: str):
    messages = history + [{"role": "user", "content": user_msg}]
    with get_client().messages.stream(
        model=MODEL,
        max_tokens=500,
        system=system,
        messages=messages,
    ) as stream:
        for text in stream.text_stream:
            yield text


def vision_chat(system: str, image_b64: str, media_type: str, text: str, max_tokens: int = 1000) -> str:
    resp = get_client().messages.create(
        model=MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": media_type, "data": image_b64},
                },
                {"type": "text", "text": text},
            ],
        }],
    )
    return resp.content[0].text


PLAN_SYSTEM = """
你是专业旅行规划师，专门为50-70岁中老年女性姐妹团规划旅行。

规划原则：
1. 每天安排2-3个景点，不超过3个，考虑体力
2. 优先选择坡度平缓、台阶少的景点，打上"轻松游"标签
3. 每天至少1个拍照出片地点，打上"出片地"标签
4. 上午安排体力消耗多的，下午安排轻松的
5. 12:00-14:00 固定安排午餐+休息
6. 餐厅选择当地老字号或口碑好的中式餐厅
7. 每天行程不要排太满，留有弹性时间

输出要求：
- 严格返回 JSON，不要任何其他文字
- 字段名与规范完全一致
- tripTitle 格式为 "{目的地}{groupType}类型 {days}日游"，sisters时含"姐妹团"
- tags 只使用：轻松游、出片地、已订票、美食推荐
- 时间格式："HH:MM"
- type 只使用：attraction、meal、transport、hotel
- id 字段用 "i_" + 序号，dayId 用 "d_" + 天数
"""

OUTFIT_SYSTEM = """
你是擅长为50-65岁女性搭配旅行穿搭的时尚顾问。
要求：
1. 推荐莫兰迪色系（低饱和度，拍照好看，适合中老年）
2. 舒适优先，绝对不推荐高跟鞋
3. 姐妹团给出统一色系方案
4. 给一条具体的拍照构图小提示
5. 只返回JSON，字段：theme/colorHex/emojiIcons(数组)/description/photoTip/items(数组，每项含category和suggestion)
"""

WEATHER_TIP_SYSTEM = "根据天气数据，用一句温馨的话给出行的阿姨提示（不超过18字）。只返回这一句话。"

EXPLAIN_SYSTEM = """
识别图片中的景点，用亲切的语言给50-70岁的旅行者讲解。
要求：
1. 先说出景点名称
2. 介绍历史背景和亮点，语言通俗易懂
3. 讲解约200字，适合45-60秒口播
4. 最后给1-2个拍照小技巧
5. 只返回JSON：placeName/explainText/highlights(数组，3条以内)
"""

PARSE_SYSTEM = """
从旅行攻略中提取关键信息，只返回JSON：
{"destination":"目的地城市","suggestedDays":天数整数,"extractedPlaces":[{"name":"景点名","type":"attraction/meal/hotel","note":"备注"}],"rawSummary":"一句话总结"}
"""

ASSISTANT_SYSTEM = """
你是妈妈旅行小助手的 AI 导游，专门服务50-70岁的中老年旅行者。
性格：亲切、耐心、像晚辈陪伴长辈
语言风格：口语化、简单易懂、多用短句
回答长度：每次不超过100字，重要信息用数字列出
你能做的事：回答景点、美食、交通问题，根据位置推荐附近去处，紧急情况给出建议（不替代拨打120）
"""
