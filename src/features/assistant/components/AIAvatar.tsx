import type { AIState } from '@/shared/types/assistant'
import MicSvg from './MicSvg'

interface Props {
  state: AIState
  size?: number
}

const WAVE_SPEED: Record<AIState, string> = {
  idle: '2.5s',
  listening: '1.2s',
  thinking: '2.5s',
  speaking: '1.8s',
}

export default function AIAvatar({ state, size = 220 }: Props) {
  const inner = Math.round(size * 0.8)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {[0, 0.6, 1.2, 1.8].map((delay, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            width: inner,
            height: inner,
            background: 'rgba(255, 255, 255, 0.18)',
            animation: `assistant-wave ${WAVE_SPEED[state]} ease-out ${delay}s infinite`,
          }}
        />
      ))}
      <div
        className="rounded-full flex items-center justify-center assistant-breath"
        style={{
          width: inner,
          height: inner,
          background: 'rgba(255, 255, 255, 0.92)',
          boxShadow: '0 12px 40px rgba(74, 53, 32, 0.25)',
        }}
      >
        <MicSvg size={Math.round(inner * 0.48)} color="#E07B3F" strokeWidth={2} />
        {state === 'thinking' && (
          <div className="absolute -top-2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: '#FFFFFF',
                  animation: `assistant-thinking 1.2s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
