import { useCallback, useEffect, useRef, useState } from 'react'
import { assistantApi } from '@/shared/api/assistantApi'
import { useTripStore } from '@/shared/store/useTripStore'
import type { AIState, DialogTurn } from '@/shared/types/assistant'
import { useSpeechRecognition } from './useSpeechRecognition'
import { useSpeechSynthesis } from './useSpeechSynthesis'

interface AICallApi {
  aiState: AIState
  turns: DialogTurn[]
  interimText: string
  startTalking: () => void
  stopTalking: () => void
  interrupt: () => void
  askText: (text: string) => Promise<void>
  hangUp: () => void
  asrSupported: boolean
  ttsSupported: boolean
}

export function useAICall(): AICallApi {
  const { currentTrip } = useTripStore()
  const [aiState, setAIState] = useState<AIState>('idle')
  const [turns, setTurns] = useState<DialogTurn[]>([])
  const turnsRef = useRef<DialogTurn[]>([])

  useEffect(() => { turnsRef.current = turns }, [turns])

  const tts = useSpeechSynthesis()

  // 把 tts 的稳定方法提出来，避免 tts.speaking 变化导致 sendToLLM 重建
  const { speak, cancel: cancelTts, supported: ttsSupported } = tts
  const speakRef = useRef(speak)
  const cancelTtsRef = useRef(cancelTts)
  useEffect(() => { speakRef.current = speak }, [speak])
  useEffect(() => { cancelTtsRef.current = cancelTts }, [cancelTts])

  const currentTripRef = useRef(currentTrip)
  useEffect(() => { currentTripRef.current = currentTrip }, [currentTrip])

  const sendToLLM = useCallback(async (userText: string) => {
    const trip = currentTripRef.current
    const userTurn: DialogTurn = {
      role: 'user',
      content: userText,
      status: 'final',
      timestamp: Date.now(),
    }
    setTurns((prev) => [...prev, userTurn])
    setAIState('thinking')

    const aiTurn: DialogTurn = { role: 'ai', content: '', status: 'interim', timestamp: Date.now() }
    setTurns((prev) => [...prev, aiTurn])

    try {
      let full = ''
      const history = turnsRef.current
        .filter((t) => t.status === 'final')
        .map((t) => ({ role: t.role === 'ai' ? 'assistant' : 'user', content: t.content }))

      await assistantApi.chat(
        userText,
        {
          currentCity: trip?.destination,
          tripId: trip?.id,
          currentDay: trip ? 1 : undefined,
        },
        history,
        (delta) => {
          full += delta
          setAIState('speaking')
          setTurns((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last?.role === 'ai') next[next.length - 1] = { ...last, content: full }
            return next
          })
        }
      )

      const finalText = full.trim() || '抱歉，我没听清楚，妈妈再说一次好吗~'
      setTurns((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === 'ai') next[next.length - 1] = { ...last, content: finalText, status: 'final' }
        return next
      })

      setAIState('speaking')
      speakRef.current(finalText, { onEnd: () => setAIState('idle') })
    } catch {
      const fallback = '网络有点慢呢～等会儿再问我吧'
      setTurns((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === 'ai') next[next.length - 1] = { ...last, content: fallback, status: 'final' }
        return next
      })
      setAIState('idle')
    }
  }, []) // 所有依赖都通过 ref 访问，sendToLLM 引用永远稳定

  const onFinal = useCallback((text: string) => {
    if (!text) { setAIState('idle'); return }
    void sendToLLM(text)
  }, [sendToLLM])

  const onError = useCallback(() => setAIState('idle'), [])

  const asr = useSpeechRecognition({ onFinal, onError })

  const startTalking = useCallback(() => {
    cancelTtsRef.current()
    setAIState('listening')
    asr.start()
  }, [asr])

  const stopTalking = useCallback(() => {
    asr.stop()
  }, [asr])

  const interrupt = useCallback(() => {
    cancelTtsRef.current()
  }, [])

  const askText = useCallback(async (text: string) => {
    if (!text.trim()) return
    cancelTtsRef.current()
    await sendToLLM(text.trim())
  }, [sendToLLM])

  const hangUp = useCallback(() => {
    asr.stop()
    cancelTtsRef.current()
    setAIState('idle')
  }, [asr])

  useEffect(() => {
    return () => { cancelTtsRef.current() }
  }, [])

  return {
    aiState,
    turns,
    interimText: asr.interimText,
    startTalking,
    stopTalking,
    interrupt,
    askText,
    hangUp,
    asrSupported: asr.supported,
    ttsSupported,
  }
}
