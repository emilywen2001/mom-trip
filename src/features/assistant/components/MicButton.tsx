import { Mic } from 'lucide-react'
import type { PointerEvent } from 'react'

interface Props {
  recording: boolean
  onPressStart: () => void
  onPressEnd: () => void
  disabled?: boolean
}

export default function MicButton({ recording, onPressStart, onPressEnd, disabled }: Props) {
  const handleStart = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    onPressStart()
  }
  const handleEnd = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.preventDefault()
    try { e.currentTarget.releasePointerCapture?.(e.pointerId) } catch { /* ignore */ }
    onPressEnd()
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
      {recording &&
        [0, 0.4].map((delay, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 80,
              height: 80,
              background: 'rgba(232, 122, 111, 0.4)',
              animation: `assistant-ping 1.4s ease-out ${delay}s infinite`,
            }}
          />
        ))}
      <button
        onPointerDown={handleStart}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        onPointerLeave={(e) => recording && handleEnd(e)}
        disabled={disabled}
        className="touchable rounded-full transition-transform"
        style={{
          width: 80,
          height: 80,
          background: recording ? '#E87A6F' : '#FFFFFF',
          transform: recording ? 'scale(0.92)' : 'scale(1)',
          boxShadow: '0 8px 24px rgba(74, 53, 32, 0.2)',
          opacity: disabled ? 0.5 : 1,
        }}
        aria-label={recording ? '松开发送' : '按住说话'}
      >
        <Mic size={32} color={recording ? '#FFFFFF' : '#E07B3F'} />
      </button>
    </div>
  )
}
