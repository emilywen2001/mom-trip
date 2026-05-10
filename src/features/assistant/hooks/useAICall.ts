import { useCallback, useEffect, useRef, useState } from 'react'
import type { AIState, DialogTurn } from '@/shared/types/assistant'
import { mockChatStream } from '../services/mockChat'
import { useSpeechSynthesis } from './useSpeechSynthesis'

interface AICallApi {
  aiState: AIState
  turns: DialogTurn[]
  /** 直接以一段文本提问（推荐卡片 / 录音 mock 转文字 / 键盘输入 都走这里） */
  askText: (text: string) => Promise<void>
  hangUp: () => void
  ttsSupported: boolean
}

/**
 * 当前演示版：mockChat 替代真实 LLM；TTS 走浏览器原生 SpeechSynthesis。
 * 真实 LLM 接通后把 mockChatStream 换成 assistantApi.chat 即可。
 */
export function useAICall(): AICallApi {
  const [aiState, setAIState] = useState<AIState>('idle')
  const [turns, setTurns] = useState<DialogTurn[]>([])
  const turnsRef = useRef<DialogTurn[]>([])

  useEffect(() => {
    turnsRef.current = turns
  }, [turns])

  const tts = useSpeechSynthesis()

  const askText = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      tts.cancel()

      const userTurn: DialogTurn = {
        role: 'user',
        content: trimmed,
        status: 'final',
        timestamp: Date.now(),
      }
      const aiTurn: DialogTurn = { role: 'ai', content: '', status: 'interim', timestamp: Date.now() + 1 }
      setTurns((prev) => [...prev, userTurn, aiTurn])
      setAIState('thinking')

      let full = ''
      try {
        await mockChatStream(trimmed, (delta) => {
          full += delta
          setTurns((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.role === 'ai') next[next.length - 1] = { ...last, content: full }
            return next
          })
        })
      } catch {
        full = '小桥这会儿有点忙呢，妈妈稍等再问我哦~'
      }

      setTurns((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last && last.role === 'ai') next[next.length - 1] = { ...last, content: full, status: 'final' }
        return next
      })

      if (tts.supported && full) {
        setAIState('speaking')
        tts.speak(full, { onEnd: () => setAIState('idle') })
      } else {
        setAIState('idle')
      }
    },
    [tts]
  )

  const hangUp = useCallback(() => {
    tts.cancel()
    setAIState('idle')
  }, [tts])

  useEffect(() => {
    return () => {
      tts.cancel()
    }
  }, [tts])

  return {
    aiState,
    turns,
    askText,
    hangUp,
    ttsSupported: tts.supported,
  }
}
