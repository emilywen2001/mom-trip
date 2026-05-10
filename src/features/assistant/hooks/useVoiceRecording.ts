import { useCallback, useEffect, useRef, useState } from 'react'
interface RecordingResult {
  /** 真识别结果，识别失败时落到 mockTranscribe(durationMs) */
  transcript: string
  durationMs: number
}

interface VoiceRecordingApi {
  /** 浏览器是否支持 webkitSpeechRecognition / SpeechRecognition */
  supported: boolean
  recording: boolean
  durationMs: number
  interimText: string
  start: () => void
  stop: () => Promise<RecordingResult | null>
  cancel: () => void
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
interface SRInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: SREvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type SRConstructor = new () => SRInstance

/**
 * 微信风格的"按住录音"hook（仅真识别）。
 * - 支持 SpeechRecognition → 实时识别，松开拿到 final transcript
 * - 不支持则返回 supported=false，由上层禁用录音入口
 */
export function useVoiceRecording(): VoiceRecordingApi {
  const recognitionRef = useRef<SRInstance | null>(null)
  const startedAtRef = useRef(0)
  const cancelledRef = useRef(false)
  const tickRef = useRef<number | null>(null)
  const finalRef = useRef('')
  const interimRef = useRef('')
  const pendingResolveRef = useRef<((r: RecordingResult | null) => void) | null>(null)
  const [recording, setRecording] = useState(false)
  const [durationMs, setDurationMs] = useState(0)
  const [interimText, setInterimText] = useState('')

  const SR: SRConstructor | null =
    typeof window !== 'undefined'
      ? ((window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor })
          .SpeechRecognition ??
        (window as unknown as { webkitSpeechRecognition?: SRConstructor }).webkitSpeechRecognition ??
        null)
      : null

  const supported = SR !== null

  const cleanup = useCallback(() => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current)
      tickRef.current = null
    }
    setRecording(false)
    setInterimText('')
  }, [])

  const start = useCallback(() => {
    if (recording) return
    cancelledRef.current = false
    finalRef.current = ''
    interimRef.current = ''
    setInterimText('')
    startedAtRef.current = Date.now()
    setDurationMs(0)
    setRecording(true)

    tickRef.current = window.setInterval(() => {
      setDurationMs(Date.now() - startedAtRef.current)
    }, 100)

    if (!SR) return
    try {
      const recognition = new SR()
      recognition.lang = 'zh-CN'
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1
      recognition.onresult = (e) => {
        let interim = ''
        let final = ''
        for (let i = 0; i < e.results.length; i++) {
          const t = e.results[i][0].transcript
          if (e.results[i].isFinal) final += t
          else interim += t
        }
        finalRef.current = final
        interimRef.current = interim
        setInterimText(interim || final)
      }
      recognition.onerror = () => { /* 失败也走 onend → mock fallback */ }
      recognition.onend = () => {
        const resolve = pendingResolveRef.current
        pendingResolveRef.current = null
        cleanup()
        if (!resolve) return
        if (cancelledRef.current) {
          resolve(null)
          return
        }
        const dur = Date.now() - startedAtRef.current
        const recognized = (finalRef.current || interimRef.current).trim()
        if (!recognized) {
          resolve(null)
          return
        }
        resolve({ transcript: recognized, durationMs: dur })
      }
      recognitionRef.current = recognition
      recognition.start()
    } catch {
      recognitionRef.current = null
    }
  }, [SR, recording, cleanup])

  const stop = useCallback((): Promise<RecordingResult | null> => {
    return new Promise((resolve) => {
      if (!recording) { resolve(null); return }
      const recognition = recognitionRef.current

      if (recognition) {
        pendingResolveRef.current = resolve
        try { recognition.stop() } catch {
          pendingResolveRef.current = null
          cleanup()
          resolve(null)
        }
      } else {
        cleanup()
        resolve(null)
      }
    })
  }, [recording, cleanup])

  const cancel = useCallback(() => {
    cancelledRef.current = true
    pendingResolveRef.current = null
    const recognition = recognitionRef.current
    if (recognition) {
      try { recognition.abort() } catch { /* ignore */ }
      recognitionRef.current = null
    }
    cleanup()
  }, [cleanup])

  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current
      if (recognition) {
        try { recognition.abort() } catch { /* ignore */ }
      }
      cleanup()
    }
  }, [cleanup])

  return { supported, recording, durationMs, interimText, start, stop, cancel }
}
