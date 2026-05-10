import type { OutfitSuggestion } from '@/shared/types/trip'

interface Props {
  outfit?: OutfitSuggestion
  onClick: () => void
}

export default function OutfitCard({ outfit, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-[20px] p-4 text-left"
      style={{ background: '#FFFFFF' }}
    >
      <p className="text-[11px] font-bold mb-2" style={{ color: '#B5A696' }}>今日穿搭</p>
      <p className="text-[22px] mb-1">{outfit?.emojiIcons.join('')}</p>
      <p className="text-[14px] font-bold" style={{ color: '#2D2A26' }}>
        {outfit?.theme}
      </p>
      <p className="text-[11px] mt-1" style={{ color: '#C8633A' }}>
        姐妹同色超出片 ✨
      </p>
    </button>
  )
}
