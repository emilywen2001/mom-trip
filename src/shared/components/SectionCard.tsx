import { type ReactNode } from 'react'

interface Props {
  title: string
  action?: { label: string; onClick: () => void }
  children: ReactNode
}

export default function SectionCard({ title, action, children }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-bold" style={{ color: '#2D2A26' }}>{title}</h3>
        {action && (
          <button onClick={action.onClick} className="flex items-center gap-1 touchable">
            <span className="text-[13px]" style={{ color: '#C8633A' }}>{action.label}</span>
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
