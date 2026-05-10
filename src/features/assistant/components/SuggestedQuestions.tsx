import { QUICK_QUESTIONS } from '@/shared/mocks/mockAssistant'

interface Props {
  onSelect: (question: string) => void
}

export default function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {QUICK_QUESTIONS.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="text-left px-4 py-3 rounded-2xl text-[14px]"
          style={{ background: '#FFFFFF', color: '#2D2A26', border: '1.5px solid #FFE8D4' }}
        >
          {q}
        </button>
      ))}
    </div>
  )
}
