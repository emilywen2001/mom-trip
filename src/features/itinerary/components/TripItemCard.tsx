import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ItineraryItem } from '@/shared/types/trip'
import { typeIcon } from '@/shared/constants/theme'
import { ROUTES } from '@/shared/constants/routes'

interface Props {
  item: ItineraryItem
}

export default function TripItemCard({ item }: Props) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      className="rounded-[20px] overflow-hidden transition-all"
      style={{
        background: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: `2px solid ${expanded ? '#E8A87C' : 'transparent'}`,
      }}
    >
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-[12px] font-bold w-10 flex-shrink-0" style={{ color: '#B5A696' }}>
          {item.time}
        </span>
        <div
          className="w-11 h-11 rounded-[13px] flex items-center justify-center text-[22px] flex-shrink-0"
          style={{ background: '#F5F1EA' }}
        >
          {typeIcon[item.type]}
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-semibold" style={{ color: '#2D2A26' }}>{item.title}</p>
          {item.address && (
            <p className="text-[11px] mt-0.5" style={{ color: '#B5A696' }}>{item.address}</p>
          )}
          {item.tags.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: '#FFE8D4', color: '#C8633A' }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        {expanded
          ? <ChevronUp size={16} color="#B5A696" />
          : <ChevronDown size={16} color="#B5A696" />
        }
      </button>

      {expanded && (
        <div className="px-4 pb-4 animate-fade-in-up" style={{ borderTop: '1px dashed #F0EBE3' }}>
          <div
            className="mt-3 rounded-[12px] p-3"
            style={{ background: 'linear-gradient(135deg, #FFF8F0, #FFEDD9)' }}
          >
            <p className="text-[11px] font-bold mb-1" style={{ color: '#C8633A' }}>💡 小贴士</p>
            <p className="text-[12px] leading-relaxed" style={{ color: '#4A3F35' }}>
              {item.description}
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => navigate(ROUTES.ASSISTANT)}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white flex items-center justify-center gap-1 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(160deg, #E8A87C 0%, #C8633A 100%)' }}
            >
              🤖 问AI
            </button>
            <button
              onClick={() => navigate(ROUTES.CAMERA)}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform"
              style={{ background: '#E4F0FB', color: '#4A8AB8' }}
            >
              📷 拍照
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform"
              style={{ background: '#E2F0E8', color: '#4A8C5C' }}
            >
              🗺 导航
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
