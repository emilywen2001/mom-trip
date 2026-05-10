import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ItineraryItem } from '@/shared/types/trip'
import { typeIcon } from '@/shared/constants/theme'

interface Props {
  item: ItineraryItem
}

export default function TripItemCard({ item }: Props) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="rounded-[16px] overflow-hidden" style={{ background: '#FFFFFF' }}>
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-[12px] font-bold w-10 flex-shrink-0" style={{ color: '#B5A696' }}>
          {item.time}
        </span>
        <span className="text-[20px]">{typeIcon[item.type]}</span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold" style={{ color: '#2D2A26' }}>{item.title}</p>
          {item.tags.length > 0 && (
            <div className="flex gap-1 mt-1">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: '#FFE8D4', color: '#C8633A' }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        {expanded ? <ChevronUp size={16} color="#B5A696" /> : <ChevronDown size={16} color="#B5A696" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4" style={{ borderTop: '1px solid #F0EBE3' }}>
          <p className="text-[14px] leading-relaxed mt-2" style={{ color: '#7B6E65' }}>
            {item.description}
          </p>
          {item.address && (
            <p className="text-[12px] mt-2" style={{ color: '#B5A696' }}>
              📍 {item.address}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
