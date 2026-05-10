import { useTripStore } from '@/shared/store/useTripStore'

// 6 pre-defined positions; we slice to match actual spot count
const ALL_PINS = [
  { vx: 60,  vy: 60,  top: '14%', left: '18%' },
  { vx: 180, vy: 110, top: '28%', left: '55%' },
  { vx: 260, vy: 200, top: '52%', left: '80%' },
  { vx: 140, vy: 260, top: '68%', left: '42%' },
  { vx: 240, vy: 310, top: '82%', left: '74%' },
  { vx: 80,  vy: 310, top: '82%', left: '24%' },
]

export default function MapTab() {
  const { currentTrip, selectedDayIndex } = useTripStore()
  if (!currentTrip) return null

  const currentDay =
    currentTrip.itineraries.find((d) => d.dayIndex === selectedDayIndex) ??
    currentTrip.itineraries[0]

  const spots = (currentDay?.items ?? []).filter((i) => i.type !== 'transport')
  const pins = ALL_PINS.slice(0, spots.length)
  const routePoints = pins.map((p) => `${p.vx},${p.vy}`).join(' ')

  return (
    <div className="px-4 pt-3 pb-8">
      <div
        className="rounded-[20px] overflow-hidden relative"
        style={{
          height: 380,
          background: 'linear-gradient(135deg, #d4e8d0, #b8d4e3)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 360" preserveAspectRatio="none">
          {pins.length > 1 && (
            <polyline
              points={routePoints}
              fill="none"
              stroke="#C8633A"
              strokeWidth="2.5"
              strokeDasharray="8 4"
              opacity="0.75"
            />
          )}
        </svg>

        {spots.map((item, i) => (
          <div
            key={item.id}
            className="absolute flex flex-col items-center"
            style={{ top: pins[i].top, left: pins[i].left, transform: 'translate(-50%, -100%)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black text-white border-[3px] border-white"
              style={{ background: '#C8633A', boxShadow: '0 2px 8px rgba(200,99,58,0.4)' }}
            >
              {i + 1}
            </div>
            <div
              className="mt-1 px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap"
              style={{ background: 'rgba(255,255,255,0.9)', color: '#2D2A26', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            >
              {item.title.slice(0, 6)}
            </div>
          </div>
        ))}

        <div
          className="absolute bottom-3 left-3 rounded-xl px-3 py-2 text-[11px] font-semibold"
          style={{ background: 'rgba(255,255,255,0.9)', color: '#7B6E65' }}
        >
          🗺 第{currentDay?.dayIndex}天 · {spots.length}个景点
        </div>
      </div>
      <p className="text-center text-[12px] mt-3" style={{ color: '#B5A696' }}>
        仅示意图，实际路线以导航为准
      </p>
    </div>
  )
}
