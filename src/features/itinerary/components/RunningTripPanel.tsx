import { useTripStore } from '@/shared/store/useTripStore'
import DaySelector from './DaySelector'
import DayTimeline from './DayTimeline'

export default function RunningTripPanel() {
  const { currentTrip, selectedDayIndex, setSelectedDay } = useTripStore()
  if (!currentTrip) return null

  const currentDay = currentTrip.itineraries.find((d) => d.dayIndex === selectedDayIndex)
    ?? currentTrip.itineraries[0]

  return (
    <div style={{ background: '#FAF7F2' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: 'linear-gradient(160deg, #6BAED6 0%, #4A8AB8 100%)' }}>
        <h1 className="text-[20px] font-bold text-white">{currentTrip.title}</h1>
        <p className="text-[13px] text-white/80 mt-1">
          {currentTrip.startDate} - {currentTrip.endDate} · {currentTrip.memberCount}人同行
        </p>
        <button
          onClick={() => { useTripStore.setState({ currentTrip: null }) }}
          className="mt-3 text-[13px] text-white/70 underline"
        >
          + 规划新旅行
        </button>
      </div>

      <DaySelector
        days={currentTrip.itineraries}
        activeDay={currentDay.dayIndex}
        onChange={setSelectedDay}
      />

      {/* Weather banner */}
      {currentDay.weather && (
        <div className="mx-4 mt-3 rounded-2xl px-4 py-2.5 flex items-center gap-3" style={{ background: '#E4F0FB' }}>
          <span className="text-[20px]">{currentDay.weather.conditionIcon}</span>
          <p className="text-[13px]" style={{ color: '#4A8AB8' }}>
            {currentDay.weather.condition} {currentDay.weather.tempHigh}°/{currentDay.weather.tempLow}° · {currentDay.weather.suggestion}
          </p>
        </div>
      )}

      {currentDay && <DayTimeline day={currentDay} />}
    </div>
  )
}
