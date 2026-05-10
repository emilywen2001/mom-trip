import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import BigButton from '@/shared/components/BigButton'
import { planApi } from '@/shared/api/tripApi'
import { useTripStore } from '@/shared/store/useTripStore'
import type { Trip } from '@/shared/types/trip'

const groupOptions = [
  { key: 'sisters', label: '姐妹团' },
  { key: 'family',  label: '家人出游' },
  { key: 'solo',    label: '独自旅行' },
  { key: 'couple',  label: '夫妻出游' },
]

const prefOptions = ['轻松', '美食', '拍照出片', '历史文化', '购物']
const dayOptions = [2, 3, 4, 5, 6, 7]

export default function PlanningPanel() {
  const { addTrip, setSelectedDay } = useTripStore()
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(4)
  const [groupType, setGroupType] = useState('sisters')
  const [memberCount, setMemberCount] = useState(4)
  const [prefs, setPrefs] = useState<string[]>(['轻松', '美食', '拍照出片'])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <div className="rounded-[20px] p-4 space-y-4" style={{ background: '#FFFFFF' }}>
      <div className="flex items-center gap-2">
        <Sparkles size={20} color="#C8633A" />
        <span className="text-[16px] font-semibold" style={{ color: '#2D2A26' }}>AI 智能规划</span>
      </div>

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

      <div>
        <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>玩几天？</label>
        <div className="flex gap-2 flex-wrap">
          {dayOptions.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className="px-4 py-2 rounded-full text-[14px] font-semibold"
              style={{ background: days === d ? '#C8633A' : '#F0EBE3', color: days === d ? 'white' : '#7B6E65' }}
            >
              {d}天
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-bold mb-2 block" style={{ color: '#7B6E65' }}>出行方式</label>
        <div className="grid grid-cols-2 gap-2">
          {groupOptions.map((g) => (
            <button
              key={g.key}
              onClick={() => setGroupType(g.key)}
              className="py-3 rounded-xl text-[14px] font-semibold"
              style={{ background: groupType === g.key ? '#C8633A' : '#F0EBE3', color: groupType === g.key ? 'white' : '#7B6E65' }}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

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
  )
}
