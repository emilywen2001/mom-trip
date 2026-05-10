import type { DialogTurn } from '@/shared/types/assistant'

interface Props {
  turn: DialogTurn
}

export default function DialogBubble({ turn }: Props) {
  const isUser = turn.role === 'user'
  const interim = turn.status === 'interim'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className="max-w-[80%] px-4 py-3 text-[16px] leading-relaxed"
        style={{
          background: isUser ? '#FFEDD5' : '#FFFFFF',
          color: '#4A3520',
          borderRadius: 16,
          borderTopRightRadius: isUser ? 4 : 16,
          borderTopLeftRadius: isUser ? 16 : 4,
          opacity: interim && isUser ? 0.7 : 1,
        }}
      >
        {turn.content}
        {interim && !isUser && (
          <span
            className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
            style={{ background: '#E07B3F' }}
          />
        )}
      </div>
    </div>
  )
}
