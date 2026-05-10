import { useState } from 'react'
import type { DayItinerary } from '@/shared/types/trip'
import TripItemCard from './TripItemCard'

const TRANSPORT_OPTIONS = [
  { icon: '🚗', way: '打车', detail: '约10分钟', price: '约¥12', rec: true },
  { icon: '🚌', way: '公交', detail: '约25分钟', price: '¥2' },
  { icon: '🚶', way: '步行', detail: '约40分钟', price: '免费' },
]

function TransportCard({ title }: { title: string }) {
  const [selected, setSelected] = useState(0)
  return (
    <div className="rounded-[16px] p-3" style={{ background: '#F5F1EA' }}>
      <p className="text-[12px] font-bold mb-2" style={{ color: '#7B6E65' }}>
        🚌 {title}
      </p>
      <div className="flex flex-col gap-1.5">
        {TRANSPORT_OPTIONS.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all"
            style={{
              background: selected === i ? '#FFFAF5' : '#FFFFFF',
              border: `1.5px solid ${selected === i ? '#E8A87C' : 'transparent'}`,
            }}
          >
            <span className="text-[15px] w-6 text-center">{opt.icon}</span>
            <div className="flex-1">
              <span className="text-[13px] font-semibold" style={{ color: '#2D2A26' }}>{opt.way}</span>
              <span className="text-[11px] ml-2" style={{ color: '#B5A696' }}>{opt.detail}</span>
            </div>
            {opt.rec && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: '#FFE8D4', color: '#C8633A' }}
              >
                推荐
              </span>
            )}
            <span className="text-[12px] font-bold" style={{ color: '#7B6E65' }}>{opt.price}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

interface Props {
  day: DayItinerary
}

export default function DayTimeline({ day }: Props) {
  const spots = day.items.filter((i) => i.type !== 'transport')

  return (
    <div className="px-4 mt-3 pb-4">
      <p className="text-[14px] font-bold mb-3" style={{ color: '#7B6E65' }}>
        {day.theme}
      </p>
      <div className="space-y-2">
        {spots.map((item, idx) => (
          <>
            <TripItemCard key={item.id} item={item} />
            {idx < spots.length - 1 && (
              <TransportCard key={`t_${item.id}`} title={`前往下一站`} />
            )}
          </>
        ))}
      </div>
    </div>
  )
}
