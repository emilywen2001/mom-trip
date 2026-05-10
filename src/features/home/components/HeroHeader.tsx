import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/shared/store/useUserStore'
import type { Trip } from '@/shared/types/trip'
import { ROUTES } from '@/shared/constants/routes'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return '早上好 ☀️'
  if (h >= 12 && h < 18) return '下午好 🌤️'
  return '晚上好 🌙'
}

function getTripSubText(trip: Trip, dayIdx: number): string {
  const remaining = trip.totalDays - dayIdx
  if (trip.status === 'ongoing') return `${trip.destination}之旅第 ${dayIdx} 天 · 还有 ${remaining} 天结束`
  if (trip.status === 'upcoming') return `${trip.destination}之旅即将开始`
  return '查看历史旅行'
}

interface Props {
  currentTrip: Trip | null
  currentDayIdx: number
  totalDays: number
}

export default function HeroHeader({ currentTrip, currentDayIdx, totalDays }: Props) {
  const { user } = useUserStore()
  const navigate = useNavigate()
  const progress = currentTrip ? currentDayIdx / totalDays : 0

  return (
    <div
      className="px-5 pt-12 pb-6"
      style={{
        background: 'linear-gradient(160deg, #E8A87C 0%, #C8633A 100%)',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}
    >
      {/* Greeting row */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-white leading-tight">
            {user?.name}，{getGreeting()}
          </h1>
          {currentTrip ? (
            <p className="text-[12px] text-white/80 mt-0.5">{getTripSubText(currentTrip, currentDayIdx)}</p>
          ) : (
            <p className="text-[12px] text-white/80 mt-0.5">还没有旅行计划</p>
          )}
        </div>
      </div>

      {/* Trip progress card */}
      {currentTrip ? (
        <div className="rounded-[20px] bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: '#FFE8D4', color: '#C8633A' }}
            >
              进行中
            </span>
            <span className="text-[12px]" style={{ color: '#B5A696' }}>
              Day {currentDayIdx}/{totalDays}
            </span>
          </div>
          <h2 className="text-[16px] font-bold mb-1" style={{ color: '#2D2A26' }}>
            {currentTrip.title}
          </h2>
          {currentTrip.itineraries[currentDayIdx - 1] && (
            <p className="text-[12px] mb-3" style={{ color: '#7B6E65' }}>
              📍 今日：{currentTrip.itineraries[currentDayIdx - 1].theme}
            </p>
          )}
          {/* Progress bar */}
          <div className="h-[5px] rounded-full" style={{ background: '#F0EBE3' }}>
            <div
              className="h-[5px] rounded-full transition-all"
              style={{
                width: `${Math.min(progress * 100, 100)}%`,
                background: 'linear-gradient(90deg, #E8A87C, #C8633A)',
              }}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-[20px] bg-white/15 border border-white/30 p-5 text-center">
          <p className="text-[15px] mb-3" style={{ color: 'rgba(255,255,255,0.8)' }}>还没有旅行计划</p>
          <button
            onClick={() => navigate(ROUTES.ITINERARY)}
            className="text-[15px] font-bold touchable"
            style={{ color: '#fff' }}
          >
            去规划一个 +
          </button>
        </div>
      )}
    </div>
  )
}
