import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import BigButton from '@/shared/components/BigButton'
import { useTripStore } from '@/shared/store/useTripStore'
import { buildMockTrip, delay } from '../utils/mockFallback'

const LOAD_STEPS = ['正在解析链接…', '识别到 6 个景点…', '智能生成行程…', '✅ 生成完毕！']

interface Props {
  onGenerated?: () => void
}

export default function GuideParserCard({ onGenerated }: Props) {
  const { addTrip, setSelectedDay } = useTripStore()
  const [showPaste, setShowPaste] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [loadStep, setLoadStep] = useState('')

  const handleParse = async () => {
    setGenerating(true)
    try {
      for (const step of LOAD_STEPS) {
        setLoadStep(step)
        await delay(600)
      }
      const trip = buildMockTrip('厦门', 4, 'sisters', 4)
      addTrip(trip)
      setSelectedDay(1)
      setShowPaste(false)
      onGenerated?.()
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
          <BigButton onClick={handleParse} loading={generating} className="mt-2">
            {generating ? (loadStep || '解析中…') : '解析攻略'}
          </BigButton>
        </div>
      )}
    </div>
  )
}
