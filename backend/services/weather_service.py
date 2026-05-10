import os
import httpx

OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY", "")
BASE = "https://api.openweathermap.org/data/2.5"

CONDITION_MAP = {
    "Clear": ("晴", "☀️"),
    "Clouds": ("多云", "⛅"),
    "Rain": ("雨", "🌧️"),
    "Drizzle": ("小雨", "🌦️"),
    "Thunderstorm": ("雷雨", "⛈️"),
    "Snow": ("雪", "❄️"),
    "Mist": ("雾", "🌫️"),
    "Haze": ("霾", "😷"),
}

CITY_CN_EN = {
    "厦门": "Xiamen", "北京": "Beijing", "上海": "Shanghai",
    "成都": "Chengdu", "杭州": "Hangzhou", "西安": "Xi'an",
    "广州": "Guangzhou", "深圳": "Shenzhen", "丽江": "Lijiang",
    "三亚": "Sanya", "桂林": "Guilin", "张家界": "Zhangjiajie",
}


async def get_forecast(city: str, days: int = 7) -> dict:
    en_city = CITY_CN_EN.get(city, city)

    if not OPENWEATHER_KEY or OPENWEATHER_KEY == "your_openweather_key_here":
        return _mock_forecast(city, days)

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{BASE}/forecast",
            params={"q": en_city, "appid": OPENWEATHER_KEY, "units": "metric", "cnt": days * 8, "lang": "zh_cn"},
            timeout=10,
        )
        if resp.status_code != 200:
            return _mock_forecast(city, days)

        data = resp.json()
        forecasts = []
        seen_dates = set()
        for item in data["list"]:
            date = item["dt_txt"][:10]
            if date in seen_dates:
                continue
            seen_dates.add(date)
            main = item["weather"][0]["main"]
            cond, icon = CONDITION_MAP.get(main, (main, "🌤️"))
            forecasts.append({
                "date": date,
                "dateDisplay": date,
                "condition": cond,
                "conditionIcon": icon,
                "tempHigh": round(item["main"]["temp_max"]),
                "tempLow": round(item["main"]["temp_min"]),
                "suggestion": _tip(cond, item["main"]["temp_max"], item["main"]["temp_min"]),
                "outfitHint": "",
            })
            if len(forecasts) >= days:
                break

        return {"city": city, "forecasts": forecasts}


def _tip(cond: str, high: float, low: float) -> str:
    diff = high - low
    tips = []
    if "雨" in cond:
        tips.append("记得带伞")
    if diff > 8:
        tips.append("早晚温差大，带件薄外套")
    if high > 30:
        tips.append("天气炎热，注意防晒补水")
    if high < 15:
        tips.append("天气较凉，注意保暖")
    return "，".join(tips) if tips else "天气不错，出行愉快"


def _mock_forecast(city: str, days: int) -> dict:
    import datetime
    today = datetime.date.today()
    forecasts = []
    conds = [("晴", "☀️", 28, 20), ("多云", "⛅", 26, 18), ("晴转多云", "🌤️", 27, 19),
             ("小雨", "🌦️", 24, 17), ("晴", "☀️", 29, 21), ("多云", "⛅", 25, 18), ("晴", "☀️", 28, 20)]
    for i in range(min(days, 7)):
        d = today + datetime.timedelta(days=i)
        cond, icon, high, low = conds[i % len(conds)]
        forecasts.append({
            "date": str(d),
            "dateDisplay": ["今天", "明天", "后天"][i] if i < 3 else str(d),
            "condition": cond,
            "conditionIcon": icon,
            "tempHigh": high,
            "tempLow": low,
            "suggestion": _tip(cond, high, low),
            "outfitHint": "建议穿轻薄透气的衣物",
        })
    return {"city": city, "forecasts": forecasts}
