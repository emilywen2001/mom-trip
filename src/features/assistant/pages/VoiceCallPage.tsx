import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronUp, Keyboard, PhoneOff, Send } from 'lucide-react'
import type { AIState } from '@/shared/types/assistant'
// mockTranscribe 已经在 useVoiceRecording 内部兜底，这里不再需要
import { useAICall } from '../hooks/useAICall'
import { useVoiceRecording } from '../hooks/useVoiceRecording'
import { unlockTTS } from '../services/ttsUnlock'
import AIAvatar from '../components/AIAvatar'
import DialogBubble from '../components/DialogBubble'
import MicButton from '../components/MicButton'

const STATE_TEXT: Record<AIState, string> = {
  idle: '小桥在等你说话',
  listening: '小桥正在听你说...',
  thinking: '小桥在想想哦...',
  speaking: '小桥正在回答~',
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function VoiceCallPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefilled = (location.state as { question?: string } | null)?.question
  const askedRef = useRef(false)

  const { aiState, turns, askText, hangUp } = useAICall()
  const recorder = useVoiceRecording()

  const [keyboardMode, setKeyboardMode] = useState(false)
  const [draft, setDraft] = useState('')
  const [willCancel, setWillCancel] = useState(false)
  const [showSlideHint, setShowSlideHint] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const subtitleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startTimeRef.current = Date.now()
    const id = setInterval(() => {
      const start = startTimeRef.current ?? Date.now()
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (prefilled && !askedRef.current) {
      askedRef.current = true
      void askText(prefilled)
    }
  }, [prefilled, askText])

  useEffect(() => {
    subtitleRef.current?.scrollTo({ top: subtitleRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, recorder.interimText])

  const handleHangUp = () => {
    recorder.cancel()
    hangUp()
    navigate(-1)
  }

  const handleSendDraft = () => {
    const text = draft.trim()
    if (!text) return
    unlockTTS()
    setDraft('')
    setKeyboardMode(false)
    void askText(text)
  }

  const handleRecordStart = () => {
    unlockTTS()
    setShowSlideHint(true)
    setWillCancel(false)
    void recorder.start()
  }

  const handleRecordCancel = () => {
    recorder.cancel()
    setShowSlideHint(false)
    setWillCancel(false)
  }

  const handleRecordSubmit = async () => {
    unlockTTS()
    const result = await recorder.stop()
    setShowSlideHint(false)
    setWillCancel(false)
    if (!result) return
    if (result.durationMs < 500) return
    void askText(result.transcript)
  }

  const recordSeconds = Math.floor(recorder.durationMs / 1000)
  const showRecordOverlay = recorder.recording

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: `
          radial-gradient(circle at 30% 20%, #FFB88C 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, #FFCAA0 0%, transparent 50%),
          linear-gradient(180deg, #FF9A56 0%, #E07B3F 100%)
        `,
        zIndex: 60,
      }}
    >
      {/* 顶部状态 */}
      <div className="text-center pt-12">
        <p className="text-[20px] font-medium text-white">
          {showRecordOverlay ? (willCancel ? '松开取消' : '正在录音...') : STATE_TEXT[aiState]}
        </p>
        <p className="text-[14px] text-white/80 mt-1">
          {showRecordOverlay ? `${recordSeconds}″` : `通话时长 ${formatDuration(elapsed)}`}
        </p>
      </div>

      {/* AI 形象 */}
      <div className="flex-1 flex items-center justify-center">
        <AIAvatar state={aiState} />
      </div>

      {/* 字幕区 */}
      <div
        ref={subtitleRef}
        className="mx-5 mb-4 px-4 py-3 overflow-y-auto"
        style={{
          maxHeight: 160,
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 20,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        {turns.length === 0 && (
          <p className="text-center text-[15px]" style={{ color: '#8B7355' }}>
            按住下方麦克风开始说话
          </p>
        )}
        {turns.map((t) => (
          <DialogBubble key={t.timestamp} turn={t} />
        ))}
        {recorder.interimText && (
          <DialogBubble
            turn={{
              role: 'user',
              content: recorder.interimText,
              status: 'interim',
              timestamp: 0,
            }}
          />
        )}
      </div>

      {/* 控制区 */}
      {!keyboardMode ? (
        <div
          className="flex items-center justify-around px-6"
          style={{ paddingBottom: 'calc(40px + env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={() => setKeyboardMode(true)}
            className="touchable rounded-full"
            style={{
              width: 56,
              height: 56,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            aria-label="切换文字"
          >
            <Keyboard size={22} color="#E07B3F" />
          </button>

          <MicButton
            onStart={handleRecordStart}
            onCancel={handleRecordCancel}
            onSubmit={handleRecordSubmit}
            onWillCancelChange={setWillCancel}
            disabled={!recorder.supported}
          />

          <button
            onClick={handleHangUp}
            className="touchable rounded-full"
            style={{ width: 56, height: 56, background: '#E87A6F', transform: 'rotate(135deg)' }}
            aria-label="挂断"
          >
            <PhoneOff size={22} color="#FFFFFF" style={{ transform: 'rotate(-135deg)' }} />
          </button>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 px-4"
          style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', paddingTop: 12 }}
        >
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendDraft()}
            placeholder="输入想问的问题…"
            className="flex-1 rounded-2xl px-4 py-3 text-[15px] outline-none"
            style={{ background: '#FFFFFF', color: '#4A3520' }}
          />
          <button
            onClick={() => setKeyboardMode(false)}
            className="touchable rounded-full"
            style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.85)' }}
          >
            <Keyboard size={18} color="#E07B3F" />
          </button>
          <button
            onClick={handleSendDraft}
            disabled={!draft.trim()}
            className="touchable rounded-full"
            style={{
              width: 44,
              height: 44,
              background: draft.trim() ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
            }}
          >
            <Send size={18} color="#E07B3F" />
          </button>
        </div>
      )}

      {/* 录音中的"上滑取消"提示气泡（盖在 mic 按钮上方） */}
      {showSlideHint && (
        <div
          className="fixed left-1/2 -translate-x-1/2 px-4 py-2 flex flex-col items-center pointer-events-none"
          style={{
            bottom: 'calc(160px + env(safe-area-inset-bottom))',
            background: willCancel ? '#E87A6F' : 'rgba(74, 53, 32, 0.85)',
            borderRadius: 16,
            zIndex: 70,
            transition: 'background 0.2s ease',
          }}
        >
          <ChevronUp size={20} color="#FFFFFF" />
          <span className="text-[13px] font-medium text-white mt-0.5">
            {willCancel ? '松开手指 取消发送' : '手指上滑 取消发送'}
          </span>
        </div>
      )}

      {!recorder.supported && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-[12px]"
          style={{ background: 'rgba(255,255,255,0.9)', color: '#E07B3F' }}
        >
          当前浏览器不支持麦克风录音，请用文字输入
        </div>
      )}
    </div>
  )
}
