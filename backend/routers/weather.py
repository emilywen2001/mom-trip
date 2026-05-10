from fastapi import APIRouter, Query
from services.weather_service import get_forecast

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/forecast")
async def forecast(city: str = Query(...), days: int = Query(7)):
    data = await get_forecast(city, days)
    return {"code": 0, "msg": "success", "data": data}
