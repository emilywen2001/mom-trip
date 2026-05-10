import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTripStore } from '@/shared/store/useTripStore'
import { ROUTES } from '@/shared/constants/routes'
import GreetingCard from '../components/GreetingCard'
import TodayWeatherCard from '../components/TodayWeatherCard'
import OutfitCard from '../components/OutfitCard'
import TodayTimelineCard from '../components/TodayTimelineCard'
import MemoryPreview from '../components/MemoryPreview'
import OutfitModal from '../components/OutfitModal'

export default function HomePage() {
  const navigate = useNavigate()
  const { currentTrip } = useTripStore()
  const [outfitOpen, setOutfitOpen] = useState(false)

  const today = currentTrip?.itineraries[1]
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
        <GreetingCard
          dayInfo={currentTrip ? { currentDay: currentDayIdx, totalDays } : undefined}
        />

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
            onClick={() => navigate(ROUTES.ITINERARY)}
            className="w-full rounded-[20px] bg-white/20 border-2 border-white/40 py-6 text-white text-[16px] font-semibold"
          >
            + 开始规划你的旅行
          </button>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">
        {today && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <TodayWeatherCard weather={today.weather} />
              <OutfitCard outfit={today.outfit} onClick={() => setOutfitOpen(true)} />
            </div>
            <TodayTimelineCard
              items={today.items}
              onViewAll={() => navigate(ROUTES.ITINERARY)}
            />
          </>
        )}
        <MemoryPreview
          onOpenCamera={() => navigate(ROUTES.CAMERA)}
          onViewAll={() => navigate(ROUTES.CAMERA)}
        />
      </div>

      <OutfitModal
        open={outfitOpen}
        onClose={() => setOutfitOpen(false)}
        outfit={today?.outfit ?? null}
      />
    </div>
  )
}
