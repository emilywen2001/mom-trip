import { X } from 'lucide-react'
import type { OutfitSuggestion } from '../../types/trip'

interface Props {
  open: boolean
  onClose: () => void
  outfit: OutfitSuggestion | null
  loading?: boolean
}

export default function OutfitModal({ open, onClose, outfit, loading }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full max-w-[480px] mx-auto rounded-t-3xl p-6 pb-10 animate-fade-in-up"
        style={{ background: '#FAF7F2' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 touchable">
          <X size={20} color="#7B6E65" />
        </button>

        <h2 className="text-[18px] font-bold mb-4" style={{ color: '#2D2A26' }}>
          今日穿搭推荐 👗
        </h2>

        {loading && (
          <div className="text-center py-8" style={{ color: '#B5A696' }}>
            AI 正在搭配穿搭方案…
          </div>
        )}

        {!loading && outfit && (
          <>
            {/* 主题色块 */}
            <div className="rounded-2xl p-4 mb-4 flex items-center gap-4" style={{ background: '#FFFFFF' }}>
              <div
                className="w-14 h-14 rounded-xl flex-shrink-0"
                style={{ background: outfit.colorHex }}
              />
              <div>
                <p className="font-bold text-[17px]" style={{ color: '#2D2A26' }}>{outfit.theme}</p>
                <p className="text-[22px]">{outfit.emojiIcons.join(' ')}</p>
              </div>
            </div>

            {/* 描述 */}
            <p className="text-[15px] leading-relaxed mb-4" style={{ color: '#7B6E65' }}>
              {outfit.description}
            </p>

            {/* 单品列表 */}
            <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#FFFFFF' }}>
              {outfit.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center px-4 py-3"
                  style={{ borderBottom: i < outfit.items.length - 1 ? '1px solid #F0EBE3' : 'none' }}
                >
                  <span className="text-[13px] font-bold w-14" style={{ color: '#B5A696' }}>
                    {item.category}
                  </span>
                  <span className="text-[15px]" style={{ color: '#2D2A26' }}>{item.suggestion}</span>
                </div>
              ))}
            </div>

            {/* 拍照提示 */}
            <div className="rounded-2xl p-4" style={{ background: '#FFE8D4' }}>
              <p className="text-[13px] font-bold mb-1" style={{ color: '#C8633A' }}>📸 拍照小技巧</p>
              <p className="text-[14px]" style={{ color: '#7B6E65' }}>{outfit.photoTip}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
