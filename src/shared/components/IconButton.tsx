import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export default function IconButton({ children, onClick, className, style }: Props) {
  return (
    <button
      onClick={onClick}
      className={`touchable rounded-full flex items-center justify-center ${className ?? ''}`}
      style={style}
    >
      {children}
    </button>
  )
}
