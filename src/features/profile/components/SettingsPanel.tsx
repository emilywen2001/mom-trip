import { ChevronRight } from 'lucide-react'
import { useUserStore } from '@/shared/store/useUserStore'

function SettingRow({ icon, iconBg, title, sub, onClick }: {
  icon: string; iconBg: string; title: string; sub?: string; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-4 w-full text-left touchable"
      style={{ borderBottom: '1px solid #F0EBE3' }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[15px] font-semibold" style={{ color: '#2D2A26' }}>{title}</p>
        {sub && <p className="text-[12px] mt-0.5" style={{ color: '#B5A696' }}>{sub}</p>}
      </div>
      <ChevronRight size={16} color="#B5A696" />
    </button>
  )
}

export default function SettingsPanel() {
  const { user, logout } = useUserStore()
  const stats = user?.stats

  return (
    <>
      {/* My content */}
      <div className="mx-4 mt-3 rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF' }}>
        <p className="text-[13px] font-bold px-4 pt-3 pb-2" style={{ color: '#B5A696' }}>我的内容</p>
        <SettingRow icon="🎬" iconBg="#E4F0FB" title="旅行视频" sub={`已生成 ${stats?.videoCount} 段`} />
        <SettingRow icon="📖" iconBg="#E2F0E8" title="旅行日记" sub={`${stats?.tripCount} 篇游记`} />
        <SettingRow icon="👯" iconBg="#FFE8D4" title="我的姐妹团" sub="常用旅伴管理" />
      </div>

      {/* Settings */}
      <div className="mx-4 mt-3 mb-6 rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF' }}>
        <p className="text-[13px] font-bold px-4 pt-3 pb-2" style={{ color: '#B5A696' }}>设置</p>
        <SettingRow icon="🔤" iconBg="#F0EBE3" title="字体大小" sub="当前：大" />
        <SettingRow icon="🔔" iconBg="#F0EBE3" title="通知设置" />
        <div
          className="flex items-center gap-3 px-4 py-4"
          style={{ borderBottom: '1px solid #F0EBE3' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px]" style={{ background: '#F0EBE3' }}>
            🌙
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold" style={{ color: '#2D2A26' }}>深色模式</p>
            <p className="text-[12px]" style={{ color: '#B5A696' }}>跟随系统</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mb-8">
        <button
          onClick={logout}
          className="w-full py-4 rounded-2xl text-[15px] font-semibold"
          style={{ background: '#FFE4E4', color: '#E74C3C' }}
        >
          退出登录
        </button>
      </div>
    </>
  )
}
