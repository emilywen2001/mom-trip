import { Plus } from 'lucide-react'
import { MOCK_PHOTOS } from '@/shared/mocks/mockTrip'

interface Props {
  onOpenCamera: () => void
  onViewAll: () => void
}

export default function MemoryStrip({ onOpenCamera, onViewAll }: Props) {
  const photos = MOCK_PHOTOS

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <h3 className="text-[15px] font-bold" style={{ color: '#2D2A26' }}>📸 旅途记忆</h3>
        <button onClick={onViewAll} className="touchable">
          <span className="text-[12px] font-semibold" style={{ color: '#C8633A' }}>查看全部 ›</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <button
          onClick={onOpenCamera}
          className="mx-4 rounded-2xl p-5 text-center w-[calc(100%-32px)]"
          style={{ background: '#FFFFFF' }}
        >
          <p className="text-[24px] mb-1">📸</p>
          <p className="text-[13px] font-semibold" style={{ color: '#2D2A26' }}>拍下旅途中的美好</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#B5A696' }}>点击相机开始记录</p>
        </button>
      ) : (
        <div
          className="flex gap-2 overflow-x-auto pb-5 px-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {photos.map((p) => (
            <div
              key={p.id}
              className="w-[72px] h-[72px] rounded-2xl flex-shrink-0 overflow-hidden relative"
            >
              <img
                src={p.thumbUrl}
                alt={p.placeName}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute bottom-0 left-0 right-0 text-center py-0.5"
                style={{ background: 'rgba(0,0,0,0.45)' }}
              >
                <span className="text-[9px] text-white">{p.placeName}</span>
              </div>
            </div>
          ))}
          {/* Add button */}
          <button
            onClick={onOpenCamera}
            className="w-[72px] h-[72px] rounded-2xl flex-shrink-0 flex items-center justify-center touchable"
            style={{ background: '#EDE6DC', border: '2px dashed #D5CCC4' }}
          >
            <Plus size={24} color="#B5A696" />
          </button>
        </div>
      )}
    </div>
  )
}
