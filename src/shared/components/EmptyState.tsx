interface Props {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon = '📭', title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-[40px] mb-3">{icon}</span>
      <p className="text-[16px] font-semibold mb-1" style={{ color: '#2D2A26' }}>{title}</p>
      {description && (
        <p className="text-[14px]" style={{ color: '#7B6E65' }}>{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-6 py-3 rounded-2xl text-[15px] font-semibold text-white"
          style={{ background: '#C8633A' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
