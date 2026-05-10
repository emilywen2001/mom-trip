import { useCallback, useEffect, useRef, useState } from 'react'

interface SpeechSynthesisApi {
  supported: boolean
  speaking: boolean
  speak: (text: string, opts?: { onEnd?: () => void; onStart?: () => void }) => void
  cancel: () => void
}

/**
 * 语音合成 hook，临时走浏览器原生 SpeechSynthesisUtterance。
 * 豆包 TTS 接入留在 backend/services/doubao_voice.py，等 Resource ID 确认后切回 fetch /api/v1/voice/tts。
 */
export function useSpeechSynthesis(): SpeechSynthesisApi {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [speaking, setSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (!supported) return
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const female = voices.find(
        (v) => v.lang.startsWith('zh') && (v.name.includes('Female') || v.name.includes('女'))
      )
      voiceRef.current = female || voices.find((v) => v.lang.startsWith('zh-CN')) || null
    }
    pickVoice()
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickVoice)
  }, [supported])

  const speak: SpeechSynthesisApi['speak'] = useCallback(
    (text, opts) => {
      if (!supported || !text) return
      try { window.speechSynthesis.resume() } catch { /* ignore */ }
      window.speechSynthesis.cancel()
      if (!voiceRef.current) {
        const voices = window.speechSynthesis.getVoices()
        const female = voices.find(
          (v) => v.lang.startsWith('zh') && (v.name.includes('Female') || v.name.includes('女'))
        )
        voiceRef.current = female || voices.find((v) => v.lang.startsWith('zh-CN')) || null
      }
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'zh-CN'
      utter.rate = 0.95
      utter.pitch = 1.1
      utter.volume = 1
      if (voiceRef.current) utter.voice = voiceRef.current
      utter.onstart = () => { setSpeaking(true); opts?.onStart?.() }
      utter.onend = () => { setSpeaking(false); opts?.onEnd?.() }
      utter.onerror = () => { setSpeaking(false); opts?.onEnd?.() }
      window.speechSynthesis.speak(utter)
    },
    [supported]
  )

  const cancel = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return { supported, speaking, speak, cancel }
}
