import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { Mic } from 'lucide-react'

interface Props {
  /** 按下开始录音 */
  onStart: () => void
  /** 上滑松开 → 取消（不发送） */
  onCancel: () => void
  /** 正常松开 → 发送 */
  onSubmit: () => void
  /** 父组件需要知道当前是否处于"将要取消"区域，用来切 overlay 文案 */
  onWillCancelChange?: (willCancel: boolean) => void
  disabled?: boolean
}

const SLIDE_UP_THRESHOLD = 60 // 上滑超过这个距离视为取消

export default function MicButton({ onStart, onCancel, onSubmit, onWillCancelChange, disabled }: Props) {
  const [pressed, setPressed] = useState(false)
  const [willCancel, setWillCancel] = useState(false)
  const startYRef = useRef(0)

  const setCancel = (v: boolean) => {
    setWillCancel(v)
    onWillCancelChange?.(v)
  }

  const handleStart = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    startYRef.current = e.clientY
    setPressed(true)
    setCancel(false)
    onStart()
  }

  const handleMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!pressed) return
    const dy = e.clientY - startYRef.current
    const next = dy < -SLIDE_UP_THRESHOLD
    if (next !== willCancel) setCancel(next)
  }

  const handleEnd = (e: PointerEvent<HTMLButtonElement>) => {
    if (!pressed) return
    e.preventDefault()
    try { e.currentTarget.releasePointerCapture?.(e.pointerId) } catch { /* ignore */ }
    setPressed(false)
    if (willCancel) onCancel()
    else onSubmit()
    setCancel(false)
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      {pressed &&
        [0, 0.4].map((delay, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 80,
              height: 80,
              background: willCancel ? 'rgba(232, 122, 111, 0.45)' : 'rgba(255, 255, 255, 0.5)',
              animation: `assistant-ping 1.4s ease-out ${delay}s infinite`,
            }}
          />
        ))}
      <button
        onPointerDown={handleStart}
        onPointerMove={handleMove}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        disabled={disabled}
        className="touchable rounded-full transition-all"
        style={{
          width: 80,
          height: 80,
          background: pressed ? (willCancel ? '#E87A6F' : '#FFFFFF') : '#FFFFFF',
          transform: pressed ? 'scale(0.94)' : 'scale(1)',
          boxShadow: '0 8px 24px rgba(74, 53, 32, 0.2)',
          opacity: disabled ? 0.5 : 1,
          touchAction: 'none',
        }}
        aria-label={pressed ? (willCancel ? '松开取消' : '松开发送') : '按住说话'}
      >
        <Mic size={32} color={pressed && willCancel ? '#FFFFFF' : '#E07B3F'} />
      </button>
    </div>
  )
}
