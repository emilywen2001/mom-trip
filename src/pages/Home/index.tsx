import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Plus } from 'lucide-react'
import { useUserStore } from '../../store/userStore'
import { useTripStore } from '../../store/tripStore'
import SosPill from '../../components/ui/SosPill'
import OutfitModal from '../../components/modals/OutfitModal'

function greeting() {
  const h = new Date().getHours()
  if (h < 6)  return { text: '夜深了，注意休息', emoji: '🌙' }
  if (h < 12) return { text: '早上好', emoji: '☀️' }
  if (h < 18) return { text: '下午好', emoji: '🌤️' }
  return { text: '晚上好', emoji: '🌙' }
}

const typeIcon: Record<string, string> = {
  attraction: '🏛️', meal: '🍜', transport: '🚌', hotel: '🏨',
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useUserStore()
  const { currentTrip } = useTripStore()
  const [outfitOpen, setOutfitOpen] = useState(false)

  const g = greeting()
  const today = currentTrip?.itineraries[1] // 第2天（进行中）
  const currentDayIdx = today?.dayIndex ?? 1
  const totalDays = currentTrip?.totalDays ?? 1
  const progress = currentDayIdx / totalDays

  return (
    <div className="page-container" style={{ background: '#FAF7F2' }}>
      {/* Hero Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(160deg, #E8A87C 0%, #C8633A 100%)' }}
      >
        {/* Greeting row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[20px] font-bold text-white leading-tight">
              {user?.name}，{g.text} {g.emoji}
            </h1>
            {currentTrip && (
              <p className="text-[13px] text-white/80 mt-0.5">
                第 {currentDayIdx} 天 · 还有 {totalDays - currentDayIdx + 1} 天结束
              </p>
            )}
          </div>
          <SosPill />
        </div>

        {/* Trip progress card */}
        {currentTrip ? (
          <div className="rounded-[20px] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: '#FFE8D4', color: '#C8633A' }}
              >
                进行中
              </span>
              <span className="text-[12px]" style={{ color: '#B5A696' }}>
                Day {currentDayIdx}/{totalDays}
              </span>
            </div>
            <h2 className="text-[17px] font-bold mb-1" style={{ color: '#2D2A26' }}>
              {currentTrip.title}
            </h2>
            <p className="text-[14px] mb-3" style={{ color: '#7B6E65' }}>
              📍 今日：{today?.theme}
            </p>
            {/* Progress bar */}
            <div className="h-2 rounded-full" style={{ background: '#F0EBE3' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${progress * 100}%`,
                  background: 'linear-gradient(90deg, #E8A87C, #C8633A)',
                }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/itinerary')}
            className="w-full rounded-[20px] bg-white/20 border-2 border-white/40 py-6 text-white text-[16px] font-semibold"
          >
            + 开始规划你的旅行
          </button>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Weather + Outfit row */}
        {today && (
          <div className="grid grid-cols-2 gap-3">
            {/* Weather */}
            <div className="rounded-[20px] p-4" style={{ background: '#FFFFFF' }}>
              <p className="text-[11px] font-bold mb-2" style={{ color: '#B5A696' }}>今日天气</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[22px]">{today.weather?.conditionIcon}</span>
                <span className="text-[18px] font-bold" style={{ color: '#2D2A26' }}>
                  {today.weather?.tempHigh}°
                </span>
              </div>
              <p className="text-[12px]" style={{ color: '#7B6E65' }}>
                {today.weather?.condition}
              </p>
              <p className="text-[11px] mt-1" style={{ color: '#B5A696' }}>
                {today.weather?.suggestion}
              </p>
            </div>

            {/* Outfit */}
            <button
              onClick={() => setOutfitOpen(true)}
              className="rounded-[20px] p-4 text-left"
              style={{ background: '#FFFFFF' }}
            >
              <p className="text-[11px] font-bold mb-2" style={{ color: '#B5A696' }}>今日穿搭</p>
              <p className="text-[22px] mb-1">{today.outfit?.emojiIcons.join('')}</p>
              <p className="text-[14px] font-bold" style={{ color: '#2D2A26' }}>
                {today.outfit?.theme}
              </p>
              <p className="text-[11px] mt-1" style={{ color: '#C8633A' }}>
                姐妹同色超出片 ✨
              </p>
            </button>
          </div>
        )}

        {/* Today's itinerary */}
        {today && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-bold" style={{ color: '#2D2A26' }}>📅 今日行程</h3>
              <button
                onClick={() => navigate('/itinerary')}
                className="flex items-center gap-1 touchable"
              >
                <span className="text-[13px]" style={{ color: '#C8633A' }}>查看全部</span>
                <ChevronRight size={14} color="#C8633A" />
              </button>
            </div>
            <div className="space-y-2">
              {today.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-[16px] p-3"
                  style={{ background: '#FFFFFF' }}
                >
                  <span className="text-[13px] font-bold w-12 flex-shrink-0" style={{ color: '#B5A696' }}>
                    {item.time}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: '#C8633A' }}
                  />
                  <span className="text-[22px]">{typeIcon[item.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold truncate" style={{ color: '#2D2A26' }}>
                      {item.title}
                    </p>
                    {item.tags.length > 0 && (
                      <div className="flex gap-1 mt-0.5">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ background: '#FFE8D4', color: '#C8633A' }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Memory strip */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] font-bold" style={{ color: '#2D2A26' }}>📸 旅途记忆</h3>
            <button
              onClick={() => navigate('/camera')}
              className="flex items-center gap-1 touchable"
            >
              <span className="text-[13px]" style={{ color: '#C8633A' }}>全部</span>
              <ChevronRight size={14} color="#C8633A" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[1, 2, 3, 4].map((seed) => (
              <div
                key={seed}
                className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden"
                style={{ background: '#F0EBE3' }}
              >
                <img
                  src={`https://picsum.photos/seed/xiamen${seed}/80/80`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <button
              onClick={() => navigate('/camera')}
              className="w-20 h-20 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center"
              style={{ background: '#F0EBE3' }}
            >
              <Plus size={20} color="#C8633A" />
              <span className="text-[11px] mt-1" style={{ color: '#C8633A' }}>拍照</span>
            </button>
          </div>
        </div>
      </div>

      <OutfitModal
        open={outfitOpen}
        onClose={() => setOutfitOpen(false)}
        outfit={today?.outfit ?? null}
      />
    </div>
  )
}
