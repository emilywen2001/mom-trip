import { useState, useEffect, useRef } from 'react'
import { useTripStore } from '@/shared/store/useTripStore'
import { planApi } from '@/shared/api/tripApi'
import GuideParserCard from '../components/GuideParserCard'
import PlanningPanel from '../components/PlanningPanel'
import RunningTripPanel from '../components/RunningTripPanel'
import TripTemplateCard from '../components/TripTemplateCard'
import type { Trip } from '@/shared/types/trip'
import { buildMockTrip, delay } from '../utils/mockFallback'

type TopTab = 'plan' | 'ongoing'

const TEMPLATES = [
  { emoji: '🏖️', name: '厦门姐妹4日游', meta: '4天3晚 · 326人用过', gradient: ['#87CEEB', '#4A8AB8'] as [string, string], dest: '厦门', days: 4 },
  { emoji: '🏯', name: '西安3天文化游', meta: '3天2晚 · 208人用过', gradient: ['#FF6B6B', '#C44040'] as [string, string], dest: '西安', days: 3 },
  { emoji: '🌿', name: '杭州西湖慢生活', meta: '3天2晚 · 189人用过', gradient: ['#90EE90', '#4A8C5C'] as [string, string], dest: '杭州', days: 3 },
]

const TEMPLATE_STEPS = ['导入热门攻略…', '匹配景点信息…', '✅ 行程已就绪！']

export default function ItineraryPage() {
  const { currentTrip, addTrip, setSelectedDay } = useTripStore()
  const [activeTab, setActiveTab] = useState<TopTab>(currentTrip ? 'ongoing' : 'plan')
  const [tplLoading, setTplLoading] = useState(false)
  const [tplStep, setTplStep] = useState('')
  const prevTripIdRef = useRef(currentTrip?.id)

  // Auto-switch to ongoing whenever a new trip is added from child components
  useEffect(() => {
    if (currentTrip?.id && currentTrip.id !== prevTripIdRef.current) {
      setActiveTab('ongoing')
    }
    prevTripIdRef.current = currentTrip?.id
  }, [currentTrip?.id])

  const handleGenerated = () => setActiveTab('ongoing')

  const handleTemplate = async (dest: string, days: number) => {
    if (tplLoading) return
    setTplLoading(true)
    for (const step of TEMPLATE_STEPS) {
      setTplStep(step)
      await delay(700)
    }
    let trip: Trip
    try {
      const res: any = await planApi.generate({
        destination: dest, days, groupType: 'sisters', memberCount: 4,
        preferences: ['轻松', '美食', '拍照出片'],
      })
      trip = {
        id: `t_${Date.now()}`,
        title: res.data?.tripTitle ?? `${dest} ${days}日游`,
        destination: dest,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + days * 86400000).toISOString().slice(0, 10),
        totalDays: days,
        groupType: 'sisters',
        memberCount: 4,
        status: 'ongoing',
        itineraries: res.data?.itineraries ?? [],
      }
    } catch {
      trip = buildMockTrip(dest, days, 'sisters', 4)
    }
    addTrip(trip)
    setSelectedDay(1)
    setTplLoading(false)
    setTplStep('')
    setActiveTab('ongoing')
  }

  return (
    <div className="page-container" style={{ background: '#FAF7F2' }}>
      {/* Top tabs */}
      <div
        className="sticky top-0 z-20 flex"
        style={{ background: '#FFFFFF', borderBottom: '1px solid #F0EBE3' }}
      >
        {(['plan', 'ongoing'] as TopTab[]).map((tab) => {
          const label = tab === 'plan' ? '规划行程' : '行程中'
          const active = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-4 text-[16px] font-bold relative"
              style={{ color: active ? '#C8633A' : '#B5A696' }}
            >
              {label}
              {active && (
                <span
                  className="absolute bottom-0 left-[30%] right-[30%] h-[3px] rounded-full"
                  style={{ background: '#C8633A' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Plan tab ── */}
      {activeTab === 'plan' && (
        <div className="px-4 pt-5 pb-8">
          <h1 className="text-[20px] font-bold mb-4" style={{ color: '#2D2A26' }}>规划旅行 ✈️</h1>

          <GuideParserCard onGenerated={handleGenerated} />

          {/* Hot templates */}
          <div className="mt-2 mb-4">
            <p className="text-[15px] font-bold mb-3" style={{ color: '#4A3F35' }}>🔥 热门攻略</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {TEMPLATES.map((t) => (
                <TripTemplateCard
                  key={t.name}
                  emoji={t.emoji}
                  name={t.name}
                  meta={tplLoading ? (tplStep || '加载中…') : t.meta}
                  gradient={t.gradient}
                  onClick={() => handleTemplate(t.dest, t.days)}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px" style={{ background: '#F0EBE3' }} />
            </div>
            <span
              className="relative px-3 text-[13px] font-semibold"
              style={{ background: '#FAF7F2', color: '#B5A696' }}
            >
              或者自己规划
            </span>
          </div>

          <PlanningPanel onGenerated={handleGenerated} />
        </div>
      )}

      {/* ── Ongoing tab ── */}
      {activeTab === 'ongoing' && (
        currentTrip
          ? <RunningTripPanel />
          : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <span className="text-[60px] mb-4">✈️</span>
              <p className="text-[18px] font-bold mb-2" style={{ color: '#2D2A26' }}>还没有行程哦</p>
              <p className="text-[14px] mb-6" style={{ color: '#B5A696' }}>
                去「规划行程」创建你的第一个旅行吧
              </p>
              <button
                onClick={() => setActiveTab('plan')}
                className="px-8 py-3 rounded-[28px] text-[15px] font-bold text-white"
                style={{ background: 'linear-gradient(160deg, #E8A87C 0%, #C8633A 100%)' }}
              >
                去规划
              </button>
            </div>
          )
      )}
    </div>
  )
}
