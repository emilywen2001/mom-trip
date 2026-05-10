import { useCallback, useEffect, useRef, useState } from 'react'

interface Options {
  lang?: string
  onFinal?: (text: string) => void
  onError?: (error: string) => void
}

interface SpeechRecognitionApi {
  supported: boolean
  listening: boolean
  interimText: string
  start: () => void
  stop: () => void
  reset: () => void
}

interface SRResult {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: { transcript: string }
}
interface SRResultList {
  readonly length: number
  [index: number]: SRResult
}
interface SREvent {
  readonly resultIndex: number
  readonly results: SRResultList
}
interface SRErrorEvent {
  readonly error: string
}
interface SRInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: SREvent) => void) | null
  onerror: ((e: SRErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type SRConstructor = new () => SRInstance

/**
 * 语音识别 hook，临时走浏览器 Web Speech API。
 * 豆包接入留在 backend/services/doubao_voice.py，等 Resource ID 确认后切回 fetch /api/v1/voice/asr。
 */
export function useSpeechRecognition({ lang = 'zh-CN', onFinal, onError }: Options = {}): SpeechRecognitionApi {
  const recognitionRef = useRef<SRInstance | null>(null)
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')

  const SR: SRConstructor | null =
    typeof window !== 'undefined'
      ? ((window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor })
          .SpeechRecognition ??
        (window as unknown as { webkitSpeechRecognition?: SRConstructor }).webkitSpeechRecognition ??
        null)
      : null
  const supported = !!SR

  useEffect(() => {
    if (!SR) return
    const recognition = new SR()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
      let interim = ''
      let finalText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript
        if (e.results[i].isFinal) finalText += transcript
        else interim += transcript
      }
      if (interim) setInterimText(interim)
      if (finalText) {
        setInterimText('')
        onFinal?.(finalText.trim())
      }
    }
    recognition.onerror = (e) => {
      onError?.(e.error || 'unknown')
      setListening(false)
    }
    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    return () => {
      try { recognition.abort() } catch { /* ignore */ }
    }
  }, [SR, lang, onFinal, onError])

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return
    setInterimText('')
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch (err) {
      onError?.(String(err))
    }
  }, [listening, onError])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    try { recognitionRef.current.stop() } catch { /* ignore */ }
  }, [])

  const reset = useCallback(() => {
    setInterimText('')
  }, [])

  return { supported, listening, interimText, start, stop, reset }
}
