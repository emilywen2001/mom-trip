import type { ItineraryItem } from '@/shared/types/trip'

interface Props {
  items: ItineraryItem[]
  onViewAll: () => void
}

export default function ItineraryCard({ items, onViewAll }: Props) {
  const display = items.slice(0, 3)

  return (
    <button
      onClick={onViewAll}
      className="rounded-[20px] p-4 text-left flex flex-col w-full"
      style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-wide" style={{ color: '#B5A696' }}>
          我的行程
        </p>
        <span className="text-[11px] font-semibold" style={{ color: '#C8633A' }}>查看全部 ›</span>
      </div>

      {display.length === 0 ? (
        <p className="text-[13px] mt-3" style={{ color: '#B5A696' }}>今天暂无行程 😊</p>
      ) : (
        <div className="mt-3 space-y-2">
          {display.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: '#C8633A' }}
              />
              <span className="text-[11px] font-bold flex-shrink-0" style={{ color: '#C8633A' }}>
                {item.time}
              </span>
              <span className="text-[13px] font-semibold truncate" style={{ color: '#2D2A26' }}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}
