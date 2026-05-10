import { useState, useEffect } from 'react'
import { useTripStore } from '@/shared/store/useTripStore'
import DaySelector from './DaySelector'
import DayTimeline from './DayTimeline'
import ChecklistCard from './ChecklistCard'
import MapTab from './MapTab'
import TravelLogTab from './TravelLogTab'

type SubTab = 'itin' | 'map' | 'checklist' | 'tlog'

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'itin',      label: '行程' },
  { key: 'map',       label: '地图' },
  { key: 'checklist', label: '清单' },
  { key: 'tlog',      label: '游记' },
]

const AI_TIPS = [
  '酒店订了没有？🏨',
  '今天记得带伞 🌧️',
  '鼓浪屿船票还没买呢～',
  '今天日落18:40，别错过！🌅',
  '记得做好防晒哦 ☀️',
  '返程车票买了吗？🚄',
  '厦大需要预约哦 📱',
]

// Mirror FloatingAssistant's defaultPosition (MAX_W=480, SIZE=64) so the bubble
// always lands just left of the bear regardless of viewport width.
function bearLeftEdgeAsRight() {
  const containerRight = (window.innerWidth + 480) / 2
  const bearCenterX = Math.min(window.innerWidth, containerRight) - 32 - 16
  return window.innerWidth - (bearCenterX - 32) // pixels from viewport right
}

function AiBubble() {
  const [msgIdx, setMsgIdx] = useState(0)
  const [visible, setBubbleVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((i) => (i + 1) % AI_TIPS.length)
      setBubbleVisible(true)
      const hide = setTimeout(() => setBubbleVisible(false), 4000)
      return () => clearTimeout(hide)
    }, 9000)
    const firstHide = setTimeout(() => setBubbleVisible(false), 4000)
    return () => { clearInterval(timer); clearTimeout(firstHide) }
  }, [])

  // 8px gap to the left of bear's left edge; vertically centred on bear (bottom≈124)
  const rightOffset = bearLeftEdgeAsRight() + 8

  return (
    <div
      className="fixed z-40"
      style={{ bottom: 124, right: rightOffset }}
    >
      <div
        className="rounded-[14px] px-3 py-2 text-[12px] font-semibold transition-all duration-300 relative"
        style={{
          background: '#FFFFFF',
          color: '#4A3F35',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          maxWidth: 180,
          lineHeight: 1.6,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.9)',
        }}
      >
        {AI_TIPS[msgIdx]}
        {/* Tail pointing right toward the 🐻 bear */}
        <span
          className="absolute"
          style={{
            right: -7,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '8px solid #FFFFFF',
          }}
        />
      </div>
    </div>
  )
}

export default function RunningTripPanel() {
  const { currentTrip, selectedDayIndex, setSelectedDay } = useTripStore()
  const [subTab, setSubTab] = useState<SubTab>('itin')

  if (!currentTrip) return null

  const currentDay =
    currentTrip.itineraries.find((d) => d.dayIndex === selectedDayIndex) ??
    currentTrip.itineraries[0]

  const totalSpots = currentTrip.itineraries.reduce(
    (acc, d) => acc + d.items.filter((i) => i.type !== 'transport').length,
    0,
  )

  return (
    <div style={{ background: '#FAF7F2' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6 text-center"
        style={{ background: 'linear-gradient(135deg, #F5C99B, #E8A87C)' }}
      >
        <h1 className="text-[19px] font-bold" style={{ color: '#4A2E1F' }}>
          🏝️ {currentTrip.title}
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#6B4530' }}>
          {currentTrip.startDate} - {currentTrip.endDate} · {currentTrip.memberCount}人同行
        </p>
        <button
          onClick={() => useTripStore.setState({ currentTrip: null })}
          className="mt-2 text-[12px] underline"
          style={{ color: '#6B4530', opacity: 0.7 }}
        >
          + 规划新旅行
        </button>
      </div>

      {/* Info bar */}
      <div
        className="flex mx-4 -mt-3 relative z-10 rounded-[16px] overflow-hidden"
        style={{ background: '#FFFFFF', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
      >
        {[
          { num: currentTrip.totalDays, label: '天' },
          { num: totalSpots,            label: '景点' },
          { num: '¥680',               label: '预估/人' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex-1 py-3 text-center"
            style={{ borderLeft: i > 0 ? '1px solid #F0EBE3' : undefined }}
          >
            <p className="text-[18px] font-black" style={{ color: '#C8633A' }}>{item.num}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#B5A696' }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div
        className="flex gap-1 mx-4 mt-4 p-1 rounded-[16px]"
        style={{ background: '#F0EBE3' }}
      >
        {SUB_TABS.map((t) => {
          const active = subTab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setSubTab(t.key)}
              className="flex-1 py-2.5 rounded-[13px] text-[13px] font-semibold transition-all"
              style={{
                background: active ? '#FFFFFF' : 'transparent',
                color: active ? '#2D2A26' : '#B5A696',
                boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : undefined,
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Weather — itinerary tab only */}
      {subTab === 'itin' && currentDay?.weather && (
        <div
          className="mx-4 mt-3 rounded-[14px] px-4 py-2.5 flex items-center gap-3"
          style={{ background: '#E4F0FB' }}
        >
          <span className="text-[22px]">{currentDay.weather.conditionIcon}</span>
          <div className="flex-1">
            <p className="text-[13px] font-bold" style={{ color: '#2D2A26' }}>
              {currentDay.weather.tempHigh}°/{currentDay.weather.tempLow}° · {currentDay.weather.condition}
            </p>
            <p className="text-[11px]" style={{ color: '#4A8AB8' }}>{currentDay.weather.suggestion}</p>
          </div>
        </div>
      )}

      {/* Day selector */}
      {(subTab === 'itin' || subTab === 'map') && (
        <DaySelector
          days={currentTrip.itineraries}
          activeDay={currentDay.dayIndex}
          onChange={setSelectedDay}
        />
      )}

      {/* Content */}
      {subTab === 'itin'      && currentDay && <DayTimeline day={currentDay} />}
      {subTab === 'map'       && <MapTab />}
      {subTab === 'checklist' && <ChecklistCard />}
      {subTab === 'tlog'      && <TravelLogTab />}

      {/* AI floating bubble — only on itinerary sub-tab */}
      {subTab === 'itin' && <AiBubble />}
    </div>
  )
}
