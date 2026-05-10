import { type ItineraryItem } from '@/shared/types/trip'
import { typeIcon } from '@/shared/constants/theme'

interface Props {
  items: ItineraryItem[]
  onViewAll: () => void
}

export default function TodayTimelineCard({ items, onViewAll }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-bold" style={{ color: '#2D2A26' }}>📅 今日行程</h3>
        <button onClick={onViewAll} className="flex items-center gap-1 touchable">
          <span className="text-[13px]" style={{ color: '#C8633A' }}>查看全部</span>
        </button>
      </div>
      <div className="space-y-2">
        {items.slice(0, 3).map((item) => (
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
  )
}
