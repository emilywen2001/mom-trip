import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
  dark?: boolean
}

export default function PageContainer({ children, dark }: Props) {
  return (
    <div
      className="page-container"
      style={{ background: dark ? '#1A1A1A' : '#FAF7F2' }}
    >
      {children}
    </div>
  )
}
