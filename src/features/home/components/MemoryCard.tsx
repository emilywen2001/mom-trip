import { Plus } from 'lucide-react'
import { MOCK_PHOTOS } from '@/shared/mocks/mockTrip'

interface Props {
  onOpenCamera: () => void
  onViewAll: () => void
}

export default function MemoryCard({ onOpenCamera, onViewAll }: Props) {
  const photos = MOCK_PHOTOS.slice(0, 3)

  return (
    <div
      className="rounded-[20px] p-4 flex flex-col min-h-[150px]"
      style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-wide" style={{ color: '#B5A696' }}>
          旅行记忆
        </p>
        <button onClick={onViewAll} className="touchable">
          <span className="text-[11px] font-semibold" style={{ color: '#C8633A' }}>全部 ›</span>
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {photos.map((p) => (
          <div
            key={p.id}
            className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: '2px solid #F0EBE3' }}
          >
            <img src={p.thumbUrl} alt={p.placeName} className="w-full h-full object-cover" />
          </div>
        ))}
        <button
          onClick={onOpenCamera}
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 touchable"
          style={{ background: '#F0EBE3', border: '2px dashed #D5CCC4' }}
        >
          <Plus size={18} color="#B5A696" />
        </button>
      </div>
    </div>
  )
}
