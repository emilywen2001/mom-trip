import { useUserStore } from '@/shared/store/useUserStore'

export default function UserHeader() {
  const { user } = useUserStore()
  const stats = user?.stats

  return (
    <div className="px-5 pt-12 pb-6" style={{ background: 'linear-gradient(160deg, #6BAED6 0%, #4A8AB8 100%)' }}>
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-[32px]"
          style={{ background: 'rgba(255,255,255,0.25)' }}
        >
          👩
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-white">{user?.name}</h1>
          <p className="text-[13px] text-white/80">旅行达人 · 已出行 {stats?.tripCount} 次</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { num: stats?.tripCount, label: '次旅行' },
          { num: stats?.cityCount, label: '个城市' },
          { num: stats?.photoCount, label: '张照片' },
          { num: stats?.videoCount, label: '段视频' },
        ].map((s) => (
          <div key={s.label} className="text-center rounded-2xl py-3" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <p className="text-[20px] font-bold text-white">{s.num}</p>
            <p className="text-[10px] text-white/70">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
