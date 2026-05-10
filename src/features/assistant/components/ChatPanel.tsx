import { useState, useRef, useEffect } from 'react'
import { Send, Mic } from 'lucide-react'
import { assistantApi } from '@/shared/api/assistantApi'
import { useUserStore } from '@/shared/store/useUserStore'
import { useTripStore } from '@/shared/store/useTripStore'
import type { ChatMessage } from '@/shared/types/assistant'
import SuggestedQuestions from './SuggestedQuestions'
import MessageBubble from './MessageBubble'
import AssistantHeader from './AssistantHeader'

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2" style={{ background: '#FFE8D4' }}>
        <span>🤖</span>
      </div>
      <div className="px-4 py-3 rounded-[18px] flex gap-1 items-center" style={{ background: '#FFFFFF' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: '#C8633A', animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatPanel() {
  const { user } = useUserStore()
  const { currentTrip } = useTripStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const send = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: msg }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setStreamingText('')

    try {
      let full = ''
      await assistantApi.chat(
        msg,
        { currentCity: currentTrip?.destination, tripId: currentTrip?.id, currentDay: 2 },
        messages.map((m) => ({ role: m.role, content: m.content })),
        (delta) => {
          full += delta
          setStreamingText(full)
        }
      )
      setMessages((prev) => [...prev, { role: 'assistant', content: full || '抱歉，我没听清楚，能再说一遍吗？' }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '网络不太好，请稍后再试 😊' }])
    } finally {
      setLoading(false)
      setStreamingText('')
    }
  }

  const startVoice = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) { alert('当前浏览器不支持语音输入'); return }
    const recognition = new SR()
    recognition.lang = 'zh-CN'
    recognition.onresult = (e: any) => {
      setInput(e.results[0][0].transcript)
    }
    recognition.start()
  }

  const showQuick = messages.length === 0

  return (
    <div className="flex flex-col" style={{ height: '100svh', background: '#FAF7F2' }}>
      <AssistantHeader />

      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: '80px' }}>
        <div className="text-center mb-6">
          <div
            className="inline-block px-4 py-3 rounded-2xl text-[14px] leading-relaxed"
            style={{ background: '#FFFFFF', color: '#7B6E65' }}
          >
            你好，{user?.name}！我是你的旅行小助手，<br />
            有任何问题都可以问我 😊
          </div>
        </div>

        {showQuick && <SuggestedQuestions onSelect={(q) => send(q)} />}

        {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}

        {loading && !streamingText && <TypingIndicator />}

        {streamingText && (
          <div className="flex justify-start mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 self-end" style={{ background: '#FFE8D4' }}>
              <span>🤖</span>
            </div>
            <div
              className="max-w-[75%] px-4 py-3 rounded-[18px] text-[15px] leading-relaxed"
              style={{ background: '#FFFFFF', color: '#2D2A26', borderBottomLeftRadius: 4 }}
            >
              {streamingText}
              <span className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: '#C8633A' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 py-3 flex items-center gap-2"
        style={{ background: '#FFFFFF', borderTop: '1px solid #F0EBE3', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
      >
        <button onClick={startVoice} className="touchable w-12 h-12 rounded-full flex-shrink-0" style={{ background: '#F0EBE3' }}>
          <Mic size={20} color="#C8633A" />
        </button>
        <input
          className="flex-1 rounded-2xl px-4 py-3 text-[15px]"
          style={{ background: '#F0EBE3', border: 'none', outline: 'none', color: '#2D2A26' }}
          placeholder="问我任何问题…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="touchable w-12 h-12 rounded-full flex-shrink-0"
          style={{ background: input.trim() ? '#C8633A' : '#F0EBE3' }}
        >
          <Send size={18} color={input.trim() ? 'white' : '#B5A696'} />
        </button>
      </div>
    </div>
  )
}
