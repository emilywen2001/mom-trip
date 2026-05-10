import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'

const AUTO_HIDE_PATHS = [ROUTES.ASSISTANT, ROUTES.VOICE_CALL]
const SIZE = 64
const MAX_W = 480
const DELETE_ZONE_HEIGHT = 140

interface Position {
  x: number
  y: number
}

const defaultPosition = (): Position => {
  if (typeof window === 'undefined') return { x: 300, y: 600 }
  const containerRight = (window.innerWidth + MAX_W) / 2
  return {
    x: Math.min(window.innerWidth, containerRight) - SIZE / 2 - 16,
    y: window.innerHeight - 110 - SIZE / 2,
  }
}

export default function FloatingAssistant() {
  const navigate = useNavigate()
  const location = useLocation()

  const [hiddenPaths, setHiddenPaths] = useState<Set<string>>(new Set())
  const [position, setPosition] = useState<Position>(defaultPosition)
  const [dragging, setDragging] = useState(false)
  const [overDeleteZone, setOverDeleteZone] = useState(false)
  const [showTip, setShowTip] = useState(true)

  const pressInfoRef = useRef<{ startX: number; startY: number; startTime: number; moved: boolean; longPressFired: boolean } | null>(null)
  const longPressTimer = useRef<number | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setShowTip(false), 3000)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const onResize = () => {
      setPosition((p) => ({
        x: Math.min(p.x, window.innerWidth - SIZE / 2),
        y: Math.min(p.y, window.innerHeight - SIZE / 2),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (AUTO_HIDE_PATHS.some((p) => location.pathname.startsWith(p))) return null
  if (hiddenPaths.has(location.pathname)) return null

  const clamp = (x: number, y: number): Position => {
    const containerLeft = Math.max(0, (window.innerWidth - MAX_W) / 2)
    const containerRight = Math.min(window.innerWidth, (window.innerWidth + MAX_W) / 2)
    return {
      x: Math.min(Math.max(x, containerLeft + SIZE / 2), containerRight - SIZE / 2),
      y: Math.min(Math.max(y, SIZE / 2 + 60), window.innerHeight - SIZE / 2 - 8),
    }
  }

  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pressInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      moved: false,
      longPressFired: false,
    }
    longPressTimer.current = window.setTimeout(() => {
      longPressTimer.current = null
      if (pressInfoRef.current && !pressInfoRef.current.moved) {
        pressInfoRef.current.longPressFired = true
        navigate(ROUTES.VOICE_CALL)
      }
    }, 600)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const info = pressInfoRef.current
    if (!info) return
    const dx = e.clientX - info.startX
    const dy = e.clientY - info.startY
    if (!info.moved && Math.hypot(dx, dy) > 8) {
      info.moved = true
      setDragging(true)
      if (longPressTimer.current !== null) {
        window.clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }
    if (info.moved) {
      const next = clamp(e.clientX, e.clientY)
      setPosition(next)
      setOverDeleteZone(e.clientY > window.innerHeight - DELETE_ZONE_HEIGHT)
    }
  }

  const handlePointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const info = pressInfoRef.current
    pressInfoRef.current = null
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }

    if (info?.moved) {
      setDragging(false)
      if (overDeleteZone) {
        setHiddenPaths((prev) => {
          const next = new Set(prev)
          next.add(location.pathname)
          return next
        })
      }
      setOverDeleteZone(false)
      return
    }

    // 单击：进 AI 主页（长按已在定时器里触发进通话页）
    if (info && !info.longPressFired) {
      navigate(ROUTES.ASSISTANT)
    }
  }

  return (
    <>
      {dragging && (
        <div
          className="fixed left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none"
          style={{
            height: DELETE_ZONE_HEIGHT,
            background: overDeleteZone
              ? 'linear-gradient(0deg, rgba(232, 122, 111, 0.65) 0%, rgba(232, 122, 111, 0) 100%)'
              : 'linear-gradient(0deg, rgba(74, 53, 32, 0.25) 0%, rgba(74, 53, 32, 0) 100%)',
            zIndex: 60,
            transition: 'background 0.2s ease',
          }}
        >
          <div
            className="flex flex-col items-center justify-center rounded-full"
            style={{
              width: overDeleteZone ? 96 : 80,
              height: overDeleteZone ? 96 : 80,
              background: overDeleteZone ? '#E87A6F' : 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 6px 20px rgba(74, 53, 32, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            <Trash2 size={overDeleteZone ? 32 : 26} color={overDeleteZone ? '#FFFFFF' : '#E87A6F'} />
            <span
              className="text-[11px] mt-1 font-medium"
              style={{ color: overDeleteZone ? '#FFFFFF' : '#E87A6F' }}
            >
              {overDeleteZone ? '松手删除' : '拖到此处'}
            </span>
          </div>
        </div>
      )}

      <button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`touchable rounded-full ${dragging ? '' : 'assistant-float'}`}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          width: SIZE,
          height: SIZE,
          background: 'radial-gradient(circle at 30% 30%, #FFD3A6 0%, #FF9A56 100%)',
          boxShadow: '0 6px 20px rgba(224, 123, 63, 0.4)',
          opacity: dragging ? 1 : 0.95,
          zIndex: 70,
          transition: dragging ? 'none' : 'opacity 0.2s ease',
          touchAction: 'none',
          fontSize: 32,
          lineHeight: 1,
        }}
        aria-label="AI 助手 小桥"
      >
        <span aria-hidden>🐻</span>
      </button>

      {showTip && !dragging && (
        <div
          className="fixed px-3 py-1 text-[12px] pointer-events-none"
          style={{
            left: position.x,
            top: position.y - SIZE / 2 - 24,
            transform: 'translateX(-100%)',
            background: '#FFFFFF',
            color: '#4A3520',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(74, 53, 32, 0.1)',
            zIndex: 70,
          }}
        >
          有问题问我哦~
        </div>
      )}
    </>
  )
}
