import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import BigButton from '@/shared/components/BigButton'
import { planApi } from '@/shared/api/tripApi'
import { useTripStore } from '@/shared/store/useTripStore'
import type { Trip } from '@/shared/types/trip'
import { buildMockTrip, delay } from '../utils/mockFallback'

const FAKE_LINK = 'https://www.xiaohongshu.com/discovery/item/6746a…'
const LOAD_STEPS = ['正在解析链接…', '识别到 6 个景点…', '智能生成行程…', '✅ 生成完毕！']

interface Props {
  onGenerated?: () => void
}

export default function GuideParserCard({ onGenerated }: Props) {
  const { addTrip, setSelectedDay } = useTripStore()
  const [showPaste, setShowPaste] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [loadStep, setLoadStep] = useState('')
  const [error, setError] = useState('')

  const handleParse = async () => {
    const content = pasteText.trim() || FAKE_LINK
    if (!pasteText.trim()) setPasteText(FAKE_LINK)

    setGenerating(true)
    setError('')
    try {
      // Show loading steps
      for (const step of LOAD_STEPS) {
        setLoadStep(step)
        await delay(700)
      }

      // Try real API, fall back to mock
      let trip: Trip
      try {
        const parsed: any = await planApi.parseLink(content)
        const dest = parsed.data?.destination ?? '厦门'
        const days = parsed.data?.suggestedDays ?? 4
        const res: any = await planApi.generate({
          destination: dest, days,
          groupType: 'sisters', memberCount: 4,
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
        trip = buildMockTrip('厦门', 4, 'sisters', 4)
      }

      addTrip(trip)
      setSelectedDay(1)
      setShowPaste(false)
      onGenerated?.()
    } catch {
      setError('解析失败，请重试')
    } finally {
      setGenerating(false)
      setLoadStep('')
    }
  }

  return (
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
            style={{ background: '#F0EBE3', color: '#2D2A26', border: 'none', outline: 'none', minHeight: 80 }}
            placeholder="粘贴小红书/马蜂窝链接或攻略内容…"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <BigButton onClick={handleParse} loading={generating} className="mt-2">
            {generating ? (loadStep || '解析中…') : '解析攻略'}
          </BigButton>
          {error && <p className="text-[13px] mt-2" style={{ color: '#E74C3C' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}
