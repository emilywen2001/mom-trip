import { useState } from 'react'
import { Sparkles, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react'
import { useTripStore } from '../../store/tripStore'
import { planApi } from '../../services/api'
import BigButton from '../../components/ui/BigButton'
import type { Trip } from '../../types/trip'

const typeIcon: Record<string, string> = {
  attraction: '🏛️', meal: '🍜', transport: '🚌', hotel: '🏨',
}

const groupOptions = [
  { key: 'sisters', label: '姐妹团' },
  { key: 'family',  label: '家人出游' },
  { key: 'solo',    label: '独自旅行' },
  { key: 'couple',  label: '夫妻出游' },
]

const prefOptions = ['轻松', '美食', '拍照出片', '历史文化', '购物']
const dayOptions = [2, 3, 4, 5, 6, 7]

export default function ItineraryPage() {
  const { currentTrip, selectedDayIndex, setSelectedDay, addTrip } = useTripStore()

  // Plan form state
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(4)
  const [groupType, setGroupType] = useState('sisters')
  const [memberCount, setMemberCount] = useState(4)
  const [prefs, setPrefs] = useState<string[]>(['轻松', '美食', '拍照出片'])
  const [pasteText, setPasteText] = useState('')
  const [showPaste, setShowPaste] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [parseResult, setParseResult] = useState<any>(null)
  const [error, setError] = useState('')

  // Itinerary view: expanded day item
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const currentDay = currentTrip?.itineraries.find((d) => d.dayIndex === selectedDayIndex)
    ?? currentTrip?.itineraries[0]

  const togglePref = (p: string) => {
    setPrefs((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])
  }

  const handleGenerate = async () => {
    if (!destination.trim()) { setError('请输入目的地'); return }
    setGenerating(true)
    setError('')
    try {
      const res: any = await planApi.generate({ destination, days, groupType, memberCount, preferences: prefs })
      const newTrip: Trip = {
        id: `t_${Date.now()}`,
        title: res.data?.tripTitle ?? `${destination} ${days}日游`,
        destination,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + days * 86400000).toISOString().slice(0, 10),
        totalDays: days,
        groupType: groupType as Trip['groupType'],
        memberCount,
        status: 'upcoming',
        itineraries: res.data?.itineraries ?? [],
      }
      addTrip(newTrip)
      setSelectedDay(1)
    } catch (e: any) {
      setError(e.message || 'AI 规划失败，请重试')
    } finally {
      setGenerating(false)
    }
  }

  const handleParse = async () => {
    if (!pasteText.trim()) return
    setGenerating(true)
    try {
      const res: any = await planApi.parseLink(pasteText)
      setParseResult(res.data)
    } catch {
      setError('解析失败，请重试')
    } finally {
      setGenerating(false)
    }
  }

  const handleUseParseResult = async () => {
    if (!parseResult) return
    setGenerating(true)
    try {
      const res: any = await planApi.generate({
        destination: parseResult.destination,
        days: parseResult.suggestedDays,
        groupType,
        memberCount,
        preferences: prefs,
      })
      const newTrip: Trip = {
        id: `t_${Date.now()}`,
        title: res.data?.tripTitle ?? `${parseResult.destination} ${parseResult.suggestedDays}日游`,
        destination: parseResult.destination,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + parseResult.suggestedDays * 86400000).toISOString().slice(0, 10),
        totalDays: parseResult.suggestedDays,
        groupType: groupType as Trip['groupType'],
        memberCount,
        status: 'upcoming',
        itineraries: res.data?.itineraries ?? [],
      }
      addTrip(newTrip)
      setParseResult(null)
      setShowPaste(false)
    } catch {
      setError('生成失败，请重试')
    } finally {
      setGenerating(false)
    }
  }

  // ─── If we have a trip, show itinerary detail ───
  if (currentTrip) {
    return (
      <div className="page-container" style={{ background: '#FAF7F2' }}>
        {/* Header */}
        <div className="px-5 pt-12 pb-5" style={{ background: 'linear-gradient(160deg, #6BAED6 0%, #4A8AB8 100%)' }}>
          <h1 className="text-[20px] font-bold text-white">{currentTrip.title}</h1>
          <p className="text-[13px] text-white/80 mt-1">
            {currentTrip.startDate} - {currentTrip.endDate} · {currentTrip.memberCount}人同行
          </p>
          {/* New trip button */}
          <button
            onClick={() => { useTripStore.setState({ currentTrip: null }) }}
            className="mt-3 text-[13px] text-white/70 underline"
          >
            + 规划新旅行
          </button>
        </div>

        {/* Day tabs */}
        <div className="flex overflow-x-auto px-4 py-3 gap-2 no-scrollbar" style={{ background: '#FFFFFF' }}>
          {currentTrip.itineraries.map((day) => {
            const active = day.dayIndex === (currentDay?.dayIndex ?? 1)
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.dayIndex)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
                style={{
                  background: active ? '#C8633A' : '#F0EBE3',
                  color: active ? 'white' : '#7B6E65',
                }}
              >
                Day {day.dayIndex}
              </button>
            )
          })}
        </div>

        {/* Weather banner */}
        {currentDay?.weather && (
          <div className="mx-4 mt-3 rounded-2xl px-4 py-2.5 flex items-center gap-3" style={{ background: '#E4F0FB' }}>
            <span className="text-[20px]">{currentDay.weather.conditionIcon}</span>
            <p className="text-[13px]" style={{ color: '#4A8AB8' }}>
              {currentDay.weather.condition} {currentDay.weather.tempHigh}°/{currentDay.weather.tempLow}° · {currentDay.weather.suggestion}
            </p>
          </div>
        )}

        {/* Day theme */}
        {currentDay && (
          <div className="px-4 mt-3">
            <p className="text-[14px] font-bold mb-3" style={{ color: '#7B6E65' }}>
              {currentDay.theme}
            </p>

            {/* Timeline */}
            <div className="space-y-2">
              {currentDay.items.map((item) => {
                const expanded = expandedItem === item.id
                return (
                  <div
                    key={item.id}
                    className="rounded-[16px] overflow-hidden"
                    style={{ background: '#FFFFFF' }}
                  >
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left"
                      onClick={() => setExpandedItem(expanded ? null : item.id)}
                    >
                      <span className="text-[12px] font-bold w-10 flex-shrink-0" style={{ color: '#B5A696' }}>
                        {item.time}
                      </span>
                      <span className="text-[20px]">{typeIcon[item.type]}</span>
                      <div className="flex-1">
                        <p className="text-[15px] font-semibold" style={{ color: '#2D2A26' }}>
                          {item.title}
                        </p>
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
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── No trip: show plan form ───
  return (
    <div className="page-container px-4 pt-12" style={{ background: '#FAF7F2' }}>
      <h1 className="text-[20px] font-bold mb-6" style={{ color: '#2D2A26' }}>规划旅行 ✈️</h1>

      {/* Paste card */}
      <div className="rounded-[20px] p-4 mb-4" style={{ background: '#FFFFFF' }}>
        <button
          className="flex items-center gap-2 w-full"
          onClick={() => setShowPaste(!showPaste)}
        >
          <ClipboardList size={20} color="#C8633A" />
          <span className="text-[16px] font-semibold flex-1 text-left" style={{ color: '#2D2A26' }}>
            一键抄作业
          </span>
          <span className="text-[12px]" style={{ color: '#B5A696' }}>粘贴小红书攻略</span>
        </button>

        {showPaste && (
          <div className="mt-3">
            <textarea
              className="w-full rounded-xl p-3 text-[14px] resize-none"
              style={{ background: '#F0EBE3', color: '#2D2A26', border: 'none', outline: 'none', minHeight: '80px' }}
              placeholder="把攻略内容粘贴在这里…"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <BigButton onClick={handleParse} loading={generating} className="mt-2">
              解析攻略
            </BigButton>
          </div>
        )}

        {/* Parse result */}
        {parseResult && (
          <div className="mt-3 p-3 rounded-xl" style={{ background: '#F0EBE3' }}>
            <p className="text-[13px] font-bold mb-2" style={{ color: '#2D2A26' }}>解析到以下内容</p>
            <p className="text-[13px] mb-1" style={{ color: '#7B6E65' }}>目的地：{parseResult.destination}</p>
            <p className="text-[13px] mb-2" style={{ color: '#7B6E65' }}>建议天数：{parseResult.suggestedDays} 天</p>
            <BigButton onClick={handleUseParseResult} loading={generating}>
              ✨ 用这个规划
            </BigButton>
          </div>
        )}
      </div>

      {/* Custom plan form */}
      <div className="rounded-[20px] p-4 space-y-4" style={{ background: '#FFFFFF' }}>
        <div className="flex items-center gap-2">
          <Sparkles size={20} color="#C8633A" />
          <span className="text-[16px] font-semibold" style={{ color: '#2D2A26' }}>AI 智能规划</span>
        </div>

        {/* Destination */}
        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>去哪里？</label>
          <input
            className="w-full rounded-xl px-4 py-3 text-[15px]"
            style={{ background: '#F0EBE3', border: 'none', outline: 'none', color: '#2D2A26' }}
            placeholder="输入目的地，如：厦门、西藏…"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Days */}
        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>玩几天？</label>
          <div className="flex gap-2 flex-wrap">
            {dayOptions.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className="px-4 py-2 rounded-full text-[14px] font-semibold"
                style={{
                  background: days === d ? '#C8633A' : '#F0EBE3',
                  color: days === d ? 'white' : '#7B6E65',
                }}
              >
                {d}天
              </button>
            ))}
          </div>
        </div>

        {/* Group type */}
        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>出行方式</label>
          <div className="grid grid-cols-2 gap-2">
            {groupOptions.map((g) => (
              <button
                key={g.key}
                onClick={() => setGroupType(g.key)}
                className="py-3 rounded-xl text-[14px] font-semibold"
                style={{
                  background: groupType === g.key ? '#C8633A' : '#F0EBE3',
                  color: groupType === g.key ? 'white' : '#7B6E65',
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* People count */}
        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>
            几人同行？{memberCount} 人
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
              className="w-10 h-10 rounded-full text-[20px] font-bold touchable"
              style={{ background: '#F0EBE3', color: '#C8633A' }}
            >
              -
            </button>
            <span className="text-[18px] font-bold w-8 text-center" style={{ color: '#2D2A26' }}>
              {memberCount}
            </span>
            <button
              onClick={() => setMemberCount(Math.min(20, memberCount + 1))}
              className="w-10 h-10 rounded-full text-[20px] font-bold touchable"
              style={{ background: '#F0EBE3', color: '#C8633A' }}
            >
              +
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>偏好（可多选）</label>
          <div className="flex flex-wrap gap-2">
            {prefOptions.map((p) => (
              <button
                key={p}
                onClick={() => togglePref(p)}
                className="px-3 py-1.5 rounded-full text-[13px] font-semibold"
                style={{
                  background: prefs.includes(p) ? '#FFE8D4' : '#F0EBE3',
                  color: prefs.includes(p) ? '#C8633A' : '#7B6E65',
                  border: prefs.includes(p) ? '1.5px solid #C8633A' : '1.5px solid transparent',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-[13px]" style={{ color: '#E74C3C' }}>{error}</p>}

        <BigButton onClick={handleGenerate} loading={generating}>
          ✨ 让 AI 帮我规划
        </BigButton>
      </div>
    </div>
  )
}
