import type { WeatherInfo, OutfitSuggestion } from '@/shared/types/trip'

interface Props {
  weather?: WeatherInfo
  outfit?: OutfitSuggestion
  onOutfitTap: () => void
}

export default function WeatherOutfitRow({ weather, outfit, onOutfitTap }: Props) {
  return (
    <div className="flex gap-2.5 px-4">
      {/* Weather card */}
      <div
        className="flex-1 rounded-2xl p-3"
        style={{ background: '#FFFFFF' }}
      >
        <p className="text-[10px] font-bold tracking-wide" style={{ color: '#B5A696' }}>
          今日天气
        </p>
        {weather ? (
          <>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[22px]">{weather.conditionIcon}</span>
              <span className="text-[18px] font-bold" style={{ color: '#2D2A26' }}>
                {weather.tempHigh}°
              </span>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: '#7B6E65' }}>{weather.condition}</p>
            <p className="text-[10px] mt-1 line-clamp-2" style={{ color: '#B5A696' }}>
              {weather.suggestion}
            </p>
          </>
        ) : (
          <div className="mt-2 h-10 rounded-lg" style={{ background: '#F5F0EB' }} />
        )}
      </div>

      {/* Outfit card */}
      <button
        onClick={onOutfitTap}
        className="flex-1 rounded-2xl p-3 text-left"
        style={{ background: '#FFFFFF' }}
      >
        <p className="text-[10px] font-bold tracking-wide" style={{ color: '#B5A696' }}>
          今日穿搭
        </p>
        {outfit ? (
          <>
            <p className="text-[20px] mt-1.5">{outfit.emojiIcons.join(' ')}</p>
            <p className="text-[12px] font-bold mt-0.5" style={{ color: '#2D2A26' }}>
              {outfit.theme}
            </p>
            <p className="text-[10px] mt-1" style={{ color: '#C8633A' }}>
              姐妹同色超出片 ✨
            </p>
          </>
        ) : (
          <>
            <p className="text-[20px] mt-1.5">✨</p>
            <p className="text-[13px] font-bold mt-0.5" style={{ color: '#2D2A26' }}>
              生成今日穿搭
            </p>
            <p className="text-[11px] mt-1" style={{ color: '#B5A696' }}>
              点击获取搭配建议
            </p>
          </>
        )}
      </button>
    </div>
  )
}
