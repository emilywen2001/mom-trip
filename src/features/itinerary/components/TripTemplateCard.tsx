interface Props {
  emoji: string
  name: string
  meta: string
  gradient: [string, string]
  onClick: () => void
}

export default function TripTemplateCard({ emoji, name, meta, gradient, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 rounded-[18px] overflow-hidden active:scale-95 transition-transform text-left"
      style={{ width: 180, background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      <div
        className="flex items-center justify-center text-[36px]"
        style={{ height: 90, background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      >
        {emoji}
      </div>
      <div className="p-3">
        <p className="text-[14px] font-bold" style={{ color: '#2D2A26' }}>{name}</p>
        <p className="text-[11px] mt-0.5" style={{ color: '#B5A696' }}>{meta}</p>
      </div>
    </button>
  )
}
