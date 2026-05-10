import { useCallback, useEffect, useRef, useState } from 'react'
import { assistantApi } from '@/shared/api/assistantApi'
import { useTripStore } from '@/shared/store/useTripStore'
import type { AIState, DialogTurn } from '@/shared/types/assistant'
import { useSpeechSynthesis } from './useSpeechSynthesis'

interface AICallApi {
  aiState: AIState
  turns: DialogTurn[]
  askText: (text: string) => Promise<void>
  hangUp: () => void
  ttsSupported: boolean
}

export function useAICall(): AICallApi {
  const { currentTrip } = useTripStore()
  const [aiState, setAIState] = useState<AIState>('idle')
  const [turns, setTurns] = useState<DialogTurn[]>([])
  const turnsRef = useRef<DialogTurn[]>([])

  useEffect(() => { turnsRef.current = turns }, [turns])

  const tts = useSpeechSynthesis()

  // 把 tts 方法存入 ref，避免 tts.speaking 变化时 askText 被重建
  const speakRef = useRef(tts.speak)
  const cancelTtsRef = useRef(tts.cancel)
  const ttsSupportedRef = useRef(tts.supported)
  useEffect(() => { speakRef.current = tts.speak }, [tts.speak])
  useEffect(() => { cancelTtsRef.current = tts.cancel }, [tts.cancel])
  useEffect(() => { ttsSupportedRef.current = tts.supported }, [tts.supported])

  const currentTripRef = useRef(currentTrip)
  useEffect(() => { currentTripRef.current = currentTrip }, [currentTrip])

  const askText = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    cancelTtsRef.current()

    const trip = currentTripRef.current
    const userTurn: DialogTurn = { role: 'user', content: trimmed, status: 'final', timestamp: Date.now() }
    const aiTurn: DialogTurn = { role: 'ai', content: '', status: 'interim', timestamp: Date.now() + 1 }
    setTurns((prev) => [...prev, userTurn, aiTurn])
    setAIState('thinking')

    let full = ''
    try {
      const history = turnsRef.current
        .filter((t) => t.status === 'final')
        .map((t) => ({ role: t.role === 'ai' ? 'assistant' : 'user', content: t.content }))

      await assistantApi.chat(
        trimmed,
        { currentCity: trip?.destination, tripId: trip?.id, currentDay: trip ? 1 : undefined },
        history,
        (delta) => {
          full += delta
          setTurns((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last?.role === 'ai') next[next.length - 1] = { ...last, content: full }
            return next
          })
        }
      )
    } catch {
      full = '小桥这会儿有点忙呢，妈妈稍等再问我哦~'
    }

    const finalText = full.trim() || '抱歉，我没听清楚，妈妈再说一次好吗~'
    setTurns((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      if (last?.role === 'ai') next[next.length - 1] = { ...last, content: finalText, status: 'final' }
      return next
    })

    if (ttsSupportedRef.current && finalText) {
      setAIState('speaking')
      speakRef.current(finalText, { onEnd: () => setAIState('idle') })
    } else {
      setAIState('idle')
    }
  }, []) // 所有依赖通过 ref 访问，引用永远稳定

  const hangUp = useCallback(() => {
    cancelTtsRef.current()
    setAIState('idle')
  }, [])

  useEffect(() => {
    return () => { cancelTtsRef.current() }
  }, [])

  return { aiState, turns, askText, hangUp, ttsSupported: tts.supported }
}
