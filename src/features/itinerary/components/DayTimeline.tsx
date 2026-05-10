import type { DayItinerary } from '@/shared/types/trip'
import TripItemCard from './TripItemCard'

interface Props {
  day: DayItinerary
}

export default function DayTimeline({ day }: Props) {
  return (
    <div className="px-4 mt-3">
      <p className="text-[14px] font-bold mb-3" style={{ color: '#7B6E65' }}>
        {day.theme}
      </p>
      <div className="space-y-2">
        {day.items.map((item) => (
          <TripItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
