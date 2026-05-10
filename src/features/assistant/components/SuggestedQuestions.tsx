import { ChevronRight } from 'lucide-react'
import { RECOMMEND_CARDS } from '@/shared/mocks/mockAssistant'

interface Props {
  onSelect: (question: string) => void
}

export default function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[15px]" style={{ color: '#8B7355' }}>💬 妈妈们都在问</span>
      </div>
      {RECOMMEND_CARDS.map((card) => (
        <button
          key={card.text}
          onClick={() => onSelect(card.question)}
          className="touchable flex items-center justify-between px-4 active:scale-[0.97] transition-all"
          style={{
            height: 58,
            background: '#FFF4E6',
            border: '1px solid rgba(255, 154, 86, 0.2)',
            borderRadius: 16,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[24px]" aria-hidden>{card.emoji}</span>
            <span className="text-[17px] font-medium" style={{ color: '#4A3520' }}>{card.text}</span>
          </div>
          <ChevronRight size={20} color="#E07B3F" />
        </button>
      ))}
    </div>
  )
}
