import type { WeatherInfo } from '@/shared/types/trip'

interface Props {
  weather?: WeatherInfo
}

export default function TodayWeatherCard({ weather }: Props) {
  return (
    <div
      className="rounded-[20px] p-4 flex flex-col min-h-[150px]"
      style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      <p className="text-[10px] font-bold tracking-wide" style={{ color: '#B5A696' }}>
        今日天气
      </p>
      {weather ? (
        <>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[28px]">{weather.conditionIcon}</span>
            <div>
              <p className="text-[24px] font-bold leading-none" style={{ color: '#2D2A26' }}>
                {weather.tempHigh}°
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: '#7B6E65' }}>{weather.condition}</p>
            </div>
          </div>
          <p className="text-[11px] mt-2 line-clamp-2" style={{ color: '#B5A696' }}>
            {weather.suggestion}
          </p>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center mt-3">
          <p className="text-[13px]" style={{ color: '#B5A696' }}>暂无数据</p>
        </div>
      )}
    </div>
  )
}
