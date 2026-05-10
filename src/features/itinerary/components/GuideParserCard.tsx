import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import BigButton from '@/shared/components/BigButton'
import { planApi } from '@/shared/api/tripApi'
import { useTripStore } from '@/shared/store/useTripStore'
import type { Trip } from '@/shared/types/trip'

export default function GuideParserCard() {
  const { addTrip, setSelectedDay } = useTripStore()
  const [showPaste, setShowPaste] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [parseResult, setParseResult] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const groupType = 'sisters'
  const memberCount = 4
  const prefs = ['轻松', '美食', '拍照出片']

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
      setSelectedDay(1)
      setParseResult(null)
      setShowPaste(false)
    } catch {
      setError('生成失败，请重试')
    } finally {
      setGenerating(false)
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

      {error && <p className="text-[13px] mt-2" style={{ color: '#E74C3C' }}>{error}</p>}
    </div>
  )
}
