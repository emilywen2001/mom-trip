import { useCallback, useEffect, useRef, useState } from 'react'

interface SpeakOptions {
  onEnd?: () => void
  onStart?: () => void
}

interface SpeechSynthesisApi {
  supported: boolean
  speaking: boolean
  speak: (text: string, opts?: SpeakOptions) => void
  cancel: () => void
}

export function useSpeechSynthesis(): SpeechSynthesisApi {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [speaking, setSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const pendingRef = useRef<{ text: string; opts?: SpeakOptions } | null>(null)

  const pickVoice = useCallback(() => {
    if (!supported) return
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) return

    // 优先：普通话女声
    const priority = [
      (v: SpeechSynthesisVoice) => v.lang === 'zh-CN' && /female|女|huihui|xiaoyi|xiaoxiao/i.test(v.name),
      (v: SpeechSynthesisVoice) => v.lang === 'zh-CN',
      (v: SpeechSynthesisVoice) => v.lang.startsWith('zh'),
    ]
    for (const test of priority) {
      const found = voices.find(test)
      if (found) { voiceRef.current = found; break }
    }
  }, [supported])

  useEffect(() => {
    if (!supported) return
    pickVoice()
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickVoice)
  }, [supported, pickVoice])

  const doSpeak = useCallback((text: string, opts?: SpeakOptions) => {
    if (!supported || !text.trim()) return

    // 部分浏览器 synthesis 在页面失焦后会暂停，主动 resume 一下
    if (window.speechSynthesis.paused) window.speechSynthesis.resume()
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'zh-CN'
    utter.rate = 0.92
    utter.pitch = 1.05
    utter.volume = 1
    if (voiceRef.current) utter.voice = voiceRef.current

    utter.onstart = () => { setSpeaking(true); opts?.onStart?.() }
    utter.onend   = () => { setSpeaking(false); opts?.onEnd?.() }
    utter.onerror = (e) => {
      // interrupted 是 cancel() 触发的，不算真正错误
      if ((e as any).error !== 'interrupted') setSpeaking(false)
      opts?.onEnd?.()
    }

    window.speechSynthesis.speak(utter)
  }, [supported])

  const speak = useCallback((text: string, opts?: SpeakOptions) => {
    if (!supported) return
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) {
      // 语音包还没加载，缓存起来等 voiceschanged 后播
      pendingRef.current = { text, opts }
      return
    }
    if (!voiceRef.current) pickVoice()
    doSpeak(text, opts)
  }, [supported, pickVoice, doSpeak])

  // 语音包加载完成后播放 pending
  useEffect(() => {
    if (!supported) return
    const handler = () => {
      pickVoice()
      if (pendingRef.current) {
        const { text, opts } = pendingRef.current
        pendingRef.current = null
        doSpeak(text, opts)
      }
    }
    window.speechSynthesis.addEventListener('voiceschanged', handler)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', handler)
  }, [supported, pickVoice, doSpeak])

  const cancel = useCallback(() => {
    if (!supported) return
    pendingRef.current = null
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return { supported, speaking, speak, cancel }
}
