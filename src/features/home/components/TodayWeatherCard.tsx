import type { WeatherInfo } from '@/shared/types/trip'

interface Props {
  weather?: WeatherInfo
}

export default function TodayWeatherCard({ weather }: Props) {
  if (!weather) return null
  return (
    <div className="rounded-[20px] p-4" style={{ background: '#FFFFFF' }}>
      <p className="text-[11px] font-bold mb-2" style={{ color: '#B5A696' }}>今日天气</p>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[22px]">{weather.conditionIcon}</span>
        <span className="text-[18px] font-bold" style={{ color: '#2D2A26' }}>
          {weather.tempHigh}°
        </span>
      </div>
      <p className="text-[12px]" style={{ color: '#7B6E65' }}>{weather.condition}</p>
      <p className="text-[11px] mt-1" style={{ color: '#B5A696' }}>{weather.suggestion}</p>
    </div>
  )
}
