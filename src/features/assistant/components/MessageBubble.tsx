import type { ChatMessage } from '@/shared/types/assistant'

interface Props {
  msg: ChatMessage
}

export default function MessageBubble({ msg }: Props) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 self-end" style={{ background: '#FFE8D4' }}>
          <span>🤖</span>
        </div>
      )}
      <div
        className="max-w-[75%] px-4 py-3 rounded-[18px] text-[15px] leading-relaxed"
        style={{
          background: isUser ? '#C8633A' : '#FFFFFF',
          color: isUser ? 'white' : '#2D2A26',
          borderBottomRightRadius: isUser ? 4 : 18,
          borderBottomLeftRadius: isUser ? 18 : 4,
        }}
      >
        {msg.content}
      </div>
    </div>
  )
}
