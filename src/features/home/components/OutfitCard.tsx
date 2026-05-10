import type { OutfitSuggestion } from '@/shared/types/trip'

interface Props {
  outfit?: OutfitSuggestion
  onClick: () => void
}

export default function OutfitCard({ outfit, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-[20px] p-4 text-left flex flex-col min-h-[150px]"
      style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      <p className="text-[10px] font-bold tracking-wide" style={{ color: '#B5A696' }}>
        今日穿搭
      </p>
      {outfit ? (
        <>
          <p className="text-[28px] mt-3">{outfit.emojiIcons.join(' ')}</p>
          <p className="text-[14px] font-bold mt-1" style={{ color: '#2D2A26' }}>
            {outfit.theme}
          </p>
          <p className="text-[11px] mt-1" style={{ color: '#C8633A' }}>
            姐妹同色超出片 ✨
          </p>
        </>
      ) : (
        <>
          <p className="text-[28px] mt-3">✨</p>
          <p className="text-[13px] font-bold mt-1" style={{ color: '#2D2A26' }}>生成今日穿搭</p>
          <p className="text-[11px] mt-1" style={{ color: '#B5A696' }}>点击获取搭配建议</p>
        </>
      )}
    </button>
  )
}
