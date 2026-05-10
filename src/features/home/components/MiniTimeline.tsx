import type { ItineraryItem } from '@/shared/types/trip'

const tagStyles: Record<string, { bg: string; color: string }> = {
  '轻松游': { bg: '#E2F0E8', color: '#4A8C5C' },
  '出片地': { bg: '#FFE8D4', color: '#C8633A' },
  '已订票': { bg: '#E4F0FB', color: '#4A8AB8' },
  '美食推荐': { bg: '#FFF4D6', color: '#D4A017' },
}

interface Props {
  items: ItineraryItem[]
  onViewAll: () => void
}

export default function MiniTimeline({ items, onViewAll }: Props) {
  const display = items.slice(0, 3)

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <h3 className="text-[15px] font-bold" style={{ color: '#2D2A26' }}>📅 今日行程</h3>
        <button onClick={onViewAll} className="touchable">
          <span className="text-[12px] font-semibold" style={{ color: '#C8633A' }}>查看全部 ›</span>
        </button>
      </div>

      {display.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-[13px]" style={{ color: '#B5A696' }}>今天暂无行程安排 😊</p>
          <button onClick={onViewAll} className="text-[12px] mt-1 touchable" style={{ color: '#C8633A' }}>
            去行程页添加活动
          </button>
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {display.map((item, idx) => {
            const isLast = idx === display.length - 1
            return (
              <div key={item.id} className="flex gap-2.5">
                {/* Time */}
                <div className="w-[38px] flex-shrink-0 pt-[13px]">
                  <span className="text-[11px] font-bold" style={{ color: '#C8633A' }}>{item.time}</span>
                </div>

                {/* Axis: dot + line */}
                <div className="w-4 flex-shrink-0 flex flex-col items-center">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: isLast ? '#B5A696' : '#C8633A' }}
                  />
                  {!isLast && (
                    <div className="flex-1 w-[2px]" style={{ background: '#EDE6DC' }} />
                  )}
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-[14px] p-2.5 mb-0.5"
                  style={{ background: '#FFFFFF' }}
                >
                  <p className="text-[13px] font-bold" style={{ color: '#2D2A26' }}>{item.title}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#7B6E65' }}>{item.description}</p>
                  {item.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {item.tags.map((t) => {
                        const s = tagStyles[t] ?? { bg: '#FFE8D4', color: '#C8633A' }
                        return (
                          <span
                            key={t}
                            className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: s.bg, color: s.color }}
                          >
                            {t}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
