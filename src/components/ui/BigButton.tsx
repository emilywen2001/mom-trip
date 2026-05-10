import { type ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  className?: string
}

export default function BigButton({
  children, onClick, variant = 'primary', disabled, loading, fullWidth = true, className,
}: Props) {
  const base = 'touchable rounded-2xl font-semibold text-[15px] px-6 transition-all active:scale-95'

  const variants = {
    primary:   'text-white shadow-md',
    secondary: 'text-white',
    outline:   'border-2 bg-transparent',
    danger:    'text-white',
  }

  const styles: Record<string, React.CSSProperties> = {
    primary:   { background: 'linear-gradient(160deg, #E8A87C 0%, #C8633A 100%)' },
    secondary: { background: 'linear-gradient(160deg, #6BAED6 0%, #4A8AB8 100%)' },
    outline:   { borderColor: '#C8633A', color: '#C8633A' },
    danger:    { background: '#E74C3C' },
  }

  return (
    <button
      onClick={() => { if (!disabled && !loading) { navigator.vibrate?.(30); onClick?.() } }}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], fullWidth && 'w-full', className)}
      style={{ ...styles[variant], minHeight: '52px', opacity: disabled ? 0.5 : 1 }}
    >
      {loading ? '加载中…' : children}
    </button>
  )
}
