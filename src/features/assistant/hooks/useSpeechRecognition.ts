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

interface SRInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: any) => void) | null
  onerror: ((e: any) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type SRConstructor = new () => SRInstance

function getSR(): SRConstructor | null {
  if (typeof window === 'undefined') return null
  return (
    (window as any).SpeechRecognition ??
    (window as any).webkitSpeechRecognition ??
    null
  )
}

export function useSpeechRecognition({ lang = 'zh-CN', onFinal, onError }: Options = {}): SpeechRecognitionApi {
  const SR = getSR()
  const supported = !!SR

  // 用 ref 保存回调，避免回调变化时重建识别实例
  const onFinalRef = useRef(onFinal)
  const onErrorRef = useRef(onError)
  useEffect(() => { onFinalRef.current = onFinal }, [onFinal])
  useEffect(() => { onErrorRef.current = onError }, [onError])

  const recognitionRef = useRef<SRInstance | null>(null)
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')

  // 识别实例只创建一次
  useEffect(() => {
    if (!SR) return
    const recognition = new SR()
    recognition.lang = lang
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (e: any) => {
      let interim = ''
      let finalText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalText += t
        else interim += t
      }
      if (interim) setInterimText(interim)
      if (finalText) {
        setInterimText('')
        onFinalRef.current?.(finalText.trim())
      }
    }
    recognition.onerror = (e: any) => {
      // 用户主动停止触发的 no-speech/aborted 不算错误
      if (e.error === 'aborted' || e.error === 'no-speech') {
        setListening(false)
        return
      }
      onErrorRef.current?.(e.error || 'unknown')
      setListening(false)
    }
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    return () => {
      try { recognition.abort() } catch { /* ignore */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SR, lang]) // lang 变才重建，回调变化不重建

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return
    setInterimText('')
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch (err) {
      // InvalidStateError: 上一次还没结束，abort 后再 start
      try {
        recognitionRef.current.abort()
        setTimeout(() => {
          setInterimText('')
          recognitionRef.current?.start()
          setListening(true)
        }, 100)
      } catch { /* ignore */ }
    }
  }, [listening])

  const stop = useCallback(() => {
    try { recognitionRef.current?.stop() } catch { /* ignore */ }
  }, [])

  const reset = useCallback(() => setInterimText(''), [])

  return { supported, listening, interimText, start, stop, reset }
}
