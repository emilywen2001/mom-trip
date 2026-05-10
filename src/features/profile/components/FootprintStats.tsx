import { useUserStore } from '@/shared/store/useUserStore'
import { ChevronRight } from 'lucide-react'

export default function FootprintStats() {
  const { user } = useUserStore()

  return (
    <div className="mx-4 mt-4 rounded-[20px] p-4 flex items-center gap-4" style={{ background: '#FFFFFF' }}>
      <div
        className="w-20 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: '#F0EBE3' }}
      >
        <span className="text-[32px]">🗺️</span>
      </div>
      <div className="flex-1">
        <h3 className="text-[15px] font-bold" style={{ color: '#2D2A26' }}>旅行足迹地图</h3>
        <p className="text-[13px]" style={{ color: '#7B6E65' }}>
          已点亮 {user?.stats?.cityCount} 座城市
        </p>
      </div>
      <ChevronRight size={16} color="#B5A696" />
    </div>
  )
}
