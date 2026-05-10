import { useState } from 'react'
import { Sparkles, Search, X } from 'lucide-react'
import BigButton from '@/shared/components/BigButton'
import { planApi } from '@/shared/api/tripApi'
import { useTripStore } from '@/shared/store/useTripStore'
import type { Trip } from '@/shared/types/trip'
import { buildMockTrip, delay } from '../utils/mockFallback'

const groupOptions = [
  { key: 'sisters', label: '姐妹团' },
  { key: 'family',  label: '家人出游' },
  { key: 'solo',    label: '独自旅行' },
  { key: 'couple',  label: '夫妻出游' },
]

const prefOptions = ['轻松', '美食', '拍照出片', '历史文化', '购物']
const dayOptions = [2, 3, 4, 5, 6, 7]

const SUGGESTED_SPOTS = [
  '🏝️ 鼓浪屿', '🏯 南普陀寺', '🎓 厦门大学',
  '🛍️ 中山路', '🌸 曾厝垵', '🌉 集美大桥',
]

const LOAD_STEPS = ['AI 正在规划…', '匹配最佳路线…', '整理景点信息…', '✅ 行程规划完毕！']

interface Props {
  onGenerated?: () => void
}

export default function PlanningPanel({ onGenerated }: Props) {
  const { addTrip, setSelectedDay } = useTripStore()

  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(4)
  const [groupType, setGroupType] = useState('sisters')
  const [memberCount, setMemberCount] = useState(4)
  const [prefs, setPrefs] = useState<string[]>(['轻松', '美食', '拍照出片'])
  const [generating, setGenerating] = useState(false)
  const [loadStep, setLoadStep] = useState('')
  const [error, setError] = useState('')

  // Self-plan mode
  const [showSelfPlan, setShowSelfPlan] = useState(false)
  const [spotSearch, setSpotSearch] = useState('')
  const [addedSpots, setAddedSpots] = useState<string[]>([])
  const [hiddenSugs, setHiddenSugs] = useState<string[]>([])

  const togglePref = (p: string) =>
    setPrefs((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])

  const addSpot = (name: string) => {
    if (addedSpots.includes(name)) return
    setAddedSpots((p) => [...p, name])
    setHiddenSugs((p) => [...p, name])
  }

  const removeSpot = (name: string) => {
    setAddedSpots((p) => p.filter((x) => x !== name))
    setHiddenSugs((p) => p.filter((x) => x !== name))
  }

  const runLoadingSteps = async (steps: string[]) => {
    for (const step of steps) {
      setLoadStep(step)
      await delay(700)
    }
  }

  const doGenerate = async (dest: string, d: number) => {
    const finalDest = dest.trim() || '厦门'
    setGenerating(true)
    setError('')
    try {
      await runLoadingSteps(LOAD_STEPS)
      let trip: Trip
      try {
        const res: any = await planApi.generate({
          destination: finalDest, days: d, groupType, memberCount, preferences: prefs,
        })
        trip = {
          id: `t_${Date.now()}`,
          title: res.data?.tripTitle ?? `${finalDest} ${d}日游`,
          destination: finalDest,
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date(Date.now() + d * 86400000).toISOString().slice(0, 10),
          totalDays: d,
          groupType: groupType as Trip['groupType'],
          memberCount,
          status: 'ongoing',
          itineraries: res.data?.itineraries ?? [],
        }
      } catch {
        // Mock fallback — demo always works
        trip = buildMockTrip(finalDest, d, groupType, memberCount)
      }
      addTrip(trip)
      setSelectedDay(1)
      onGenerated?.()
    } catch (e: any) {
      setError('生成失败，请重试')
    } finally {
      setGenerating(false)
      setLoadStep('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Form card */}
      <div className="rounded-[20px] p-4 space-y-4" style={{ background: '#FFFFFF' }}>
        <div className="flex items-center gap-2">
          <Sparkles size={20} color="#C8633A" />
          <span className="text-[16px] font-semibold" style={{ color: '#2D2A26' }}>填写出行信息</span>
        </div>

        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>📍 去哪里？</label>
          <input
            className="w-full rounded-xl px-4 py-3 text-[15px]"
            style={{ background: '#F0EBE3', border: 'none', outline: 'none', color: '#2D2A26' }}
            placeholder="输入目的地，不填则默认厦门"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>📅 玩几天？</label>
          <div className="flex gap-2 flex-wrap">
            {dayOptions.map((d) => (
              <button key={d} onClick={() => setDays(d)}
                className="px-4 py-2 rounded-full text-[14px] font-semibold transition-colors"
                style={{ background: days === d ? '#C8633A' : '#F0EBE3', color: days === d ? 'white' : '#7B6E65' }}>
                {d}天
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>🎯 和谁一起？</label>
          <div className="grid grid-cols-2 gap-2">
            {groupOptions.map((g) => (
              <button key={g.key} onClick={() => setGroupType(g.key)}
                className="py-3 rounded-xl text-[14px] font-semibold transition-colors"
                style={{ background: groupType === g.key ? '#C8633A' : '#F0EBE3', color: groupType === g.key ? 'white' : '#7B6E65' }}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>
            👥 几人同行？{memberCount} 人
          </label>
          <div className="flex items-center gap-4">
            <button onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
              className="w-10 h-10 rounded-full text-[20px] font-bold touchable"
              style={{ background: '#F0EBE3', color: '#C8633A' }}>-</button>
            <span className="text-[18px] font-bold w-8 text-center" style={{ color: '#2D2A26' }}>{memberCount}</span>
            <button onClick={() => setMemberCount(Math.min(20, memberCount + 1))}
              className="w-10 h-10 rounded-full text-[20px] font-bold touchable"
              style={{ background: '#F0EBE3', color: '#C8633A' }}>+</button>
          </div>
        </div>

        <div>
          <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>偏好（可多选）</label>
          <div className="flex flex-wrap gap-2">
            {prefOptions.map((p) => (
              <button key={p} onClick={() => togglePref(p)}
                className="px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all"
                style={{
                  background: prefs.includes(p) ? '#FFE8D4' : '#F0EBE3',
                  color: prefs.includes(p) ? '#C8633A' : '#7B6E65',
                  border: prefs.includes(p) ? '1.5px solid #C8633A' : '1.5px solid transparent',
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-[13px]" style={{ color: '#E74C3C' }}>{error}</p>}
      </div>

      {/* Two CTA buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowSelfPlan(!showSelfPlan)}
          className="flex-1 py-4 rounded-[28px] text-[15px] font-bold active:scale-95 transition-transform"
          style={{ background: '#FFFFFF', color: '#C8633A', border: '2px solid #C8633A' }}>
          🗂 自己安排
        </button>
        <button
          onClick={() => doGenerate(destination, days)}
          disabled={generating}
          className="flex-1 py-4 rounded-[28px] text-[15px] font-bold text-white active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(160deg, #E8A87C 0%, #C8633A 100%)',
            opacity: generating ? 0.7 : 1,
          }}>
          {generating ? (loadStep || 'AI规划中…') : '✨ AI帮我规划'}
        </button>
      </div>

      {/* Self-plan panel */}
      {showSelfPlan && (
        <div className="rounded-[20px] p-4 animate-fade-in-up" style={{ background: '#FFFFFF' }}>
          <p className="text-[15px] font-bold mb-3" style={{ color: '#4A3F35' }}>📍 添加你要去的景点</p>

          <div className="flex gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 rounded-xl px-3" style={{ background: '#F0EBE3' }}>
              <Search size={15} color="#B5A696" />
              <input
                className="flex-1 py-3 text-[14px] bg-transparent outline-none"
                style={{ color: '#2D2A26' }}
                placeholder="搜索景点…"
                value={spotSearch}
                onChange={(e) => setSpotSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && spotSearch.trim()) {
                    addSpot(spotSearch.trim()); setSpotSearch('')
                  }
                }}
              />
            </div>
            <button
              className="px-4 py-3 rounded-xl text-[13px] font-bold text-white active:scale-95 transition-transform"
              style={{ background: '#C8633A' }}
              onClick={() => { if (spotSearch.trim()) { addSpot(spotSearch.trim()); setSpotSearch('') } }}>
              添加
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED_SPOTS.filter((s) => !hiddenSugs.includes(s)).map((s) => (
              <button key={s} onClick={() => addSpot(s)}
                className="px-3 py-2 rounded-[14px] text-[13px] active:scale-95 transition-transform"
                style={{ background: '#F0EBE3', color: '#4A3F35' }}>
                {s}
              </button>
            ))}
          </div>

          {addedSpots.length > 0 && (
            <div>
              <p className="text-[12px] font-bold mb-2" style={{ color: '#B5A696' }}>
                已选景点（点击 × 删除）
              </p>
              <div className="space-y-2 mb-3">
                {addedSpots.map((s) => (
                  <div key={s} className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: '#F0EBE3' }}>
                    <span className="text-[14px] font-semibold flex-1" style={{ color: '#2D2A26' }}>{s}</span>
                    <button onClick={() => removeSpot(s)}><X size={16} color="#E74C3C" /></button>
                  </div>
                ))}
              </div>
              <BigButton
                onClick={() => doGenerate(destination || '厦门', days)}
                loading={generating}>
                {generating ? (loadStep || '生成中…') : '✅ 生成我的行程'}
              </BigButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
