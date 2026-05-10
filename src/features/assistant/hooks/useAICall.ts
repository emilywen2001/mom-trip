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
  /** 用户按下麦克风：开始录音 */
  startTalking: () => void
  /** 用户松开麦克风：结束录音、提交识别结果 */
  stopTalking: () => void
  /** 中断 AI 当前播放（重新开始录音时调用） */
  interrupt: () => void
  /** 直接以一段文本提问（推荐卡片场景） */
  askText: (text: string) => Promise<void>
  /** 退出会话：取消所有进行中的语音 */
  hangUp: () => void
  asrSupported: boolean
  ttsSupported: boolean
}

/**
 * 整合 ASR → LLM → TTS 的对话编排器。
 * 当前 ASR/TTS 走 Web Speech API，LLM 走后端 /api/v1/assistant/chat（已对接 DeepSeek）。
 * 后续接入豆包语音模型时，只需替换 useSpeechRecognition / useSpeechSynthesis 实现。
 */
export function useAICall(): AICallApi {
  const { currentTrip } = useTripStore()
  const [aiState, setAIState] = useState<AIState>('idle')
  const [turns, setTurns] = useState<DialogTurn[]>([])
  const turnsRef = useRef<DialogTurn[]>([])

  useEffect(() => {
    turnsRef.current = turns
  }, [turns])

  const tts = useSpeechSynthesis()

  const sendToLLM = useCallback(
    async (userText: string) => {
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
            currentCity: currentTrip?.destination,
            tripId: currentTrip?.id,
            currentDay: currentTrip ? 1 : undefined,
          },
          history,
          (delta) => {
            full += delta
            setTurns((prev) => {
              const next = [...prev]
              const last = next[next.length - 1]
              if (last && last.role === 'ai') next[next.length - 1] = { ...last, content: full }
              return next
            })
          }
        )

        const finalText = full.trim() || '抱歉，我没听清楚，妈妈再说一次好吗~'
        setTurns((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last && last.role === 'ai') next[next.length - 1] = { ...last, content: finalText, status: 'final' }
          return next
        })

        setAIState('speaking')
        if (tts.supported) {
          tts.speak(finalText, { onEnd: () => setAIState('idle') })
        } else {
          setAIState('idle')
        }
      } catch {
        const fallback = '网络有点慢呢～等会儿再问我吧'
        setTurns((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last && last.role === 'ai') next[next.length - 1] = { ...last, content: fallback, status: 'final' }
          return next
        })
        setAIState('idle')
      }
    },
    [currentTrip, tts]
  )

  const asr = useSpeechRecognition({
    onFinal: (text) => {
      if (!text) {
        setAIState('idle')
        return
      }
      void sendToLLM(text)
    },
    onError: () => setAIState('idle'),
  })

  const startTalking = useCallback(() => {
    if (tts.speaking) tts.cancel()
    setAIState('listening')
    asr.start()
  }, [asr, tts])

  const stopTalking = useCallback(() => {
    asr.stop()
  }, [asr])

  const interrupt = useCallback(() => {
    tts.cancel()
  }, [tts])

  const askText = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      tts.cancel()
      await sendToLLM(text.trim())
    },
    [sendToLLM, tts]
  )

  const hangUp = useCallback(() => {
    asr.stop()
    tts.cancel()
    setAIState('idle')
  }, [asr, tts])

  useEffect(() => {
    return () => {
      tts.cancel()
    }
  }, [tts])

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
    ttsSupported: tts.supported,
  }
}
