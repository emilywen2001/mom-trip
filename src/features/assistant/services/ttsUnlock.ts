/**
 * 在用户手势的同步栈内调用一次，"解锁"浏览器的 SpeechSynthesis。
 * Chrome / iOS Safari 严格 autoplay 策略要求第一次 speak 必须在 user-gesture 内，
 * 否则之后异步发起的 speak() 会被静默拦截 —— 表现为 AI 文字出来了但没声音。
 *
 * 调用幂等，多次调用也无害（speak("") 不会真发声）。
 */
export function unlockTTS(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    if (window.speechSynthesis.paused) window.speechSynthesis.resume()
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    u.lang = 'zh-CN'
    window.speechSynthesis.speak(u)
  } catch {
    /* ignore */
  }
}
