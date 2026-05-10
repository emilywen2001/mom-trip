import type { DayItinerary } from '@/shared/types/trip'

interface Props {
  days: DayItinerary[]
  activeDay: number
  onChange: (dayIndex: number) => void
}

export default function DaySelector({ days, activeDay, onChange }: Props) {
  return (
    <div className="flex overflow-x-auto px-4 py-3 gap-2 no-scrollbar">
      {days.map((day) => {
        const isActive = day.dayIndex === activeDay
        const emoji = day.weather?.conditionIcon ?? '☀️'
        return (
          <button
            key={day.id}
            onClick={() => onChange(day.dayIndex)}
            className="flex-shrink-0 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all active:scale-95"
            style={{
              background: isActive ? '#C8633A' : '#F0EBE3',
              color: isActive ? 'white' : '#7B6E65',
              border: `2px solid ${isActive ? '#C8633A' : 'transparent'}`,
            }}
          >
            第{day.dayIndex}天 {emoji}
          </button>
        )
      })}
    </div>
  )
}
