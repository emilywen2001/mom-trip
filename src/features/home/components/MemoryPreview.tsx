import { Plus } from 'lucide-react'

interface Props {
  onOpenCamera: () => void
  onViewAll: () => void
}

export default function MemoryPreview({ onOpenCamera, onViewAll }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-bold" style={{ color: '#2D2A26' }}>📸 旅途记忆</h3>
        <button onClick={onViewAll} className="flex items-center gap-1 touchable">
          <span className="text-[13px]" style={{ color: '#C8633A' }}>全部</span>
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[1, 2, 3, 4].map((seed) => (
          <div
            key={seed}
            className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden"
            style={{ background: '#F0EBE3' }}
          >
            <img
              src={`https://picsum.photos/seed/xiamen${seed}/80/80`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <button
          onClick={onOpenCamera}
          className="w-20 h-20 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center"
          style={{ background: '#F0EBE3' }}
        >
          <Plus size={20} color="#C8633A" />
          <span className="text-[11px] mt-1" style={{ color: '#C8633A' }}>拍照</span>
        </button>
      </div>
    </div>
  )
}
