import { ChevronRight } from 'lucide-react'
import { useUserStore } from '../../store/userStore'

interface RowProps {
  icon: string
  iconBg: string
  title: string
  sub?: string
  badge?: string
  badgeColor?: 'green' | 'red' | 'orange'
  onClick?: () => void
}

function SettingRow({ icon, iconBg, title, sub, badge, badgeColor = 'green', onClick }: RowProps) {
  const badgeColors = {
    green:  { bg: '#E2F0E8', color: '#4A8C5C' },
    red:    { bg: '#FFE4E4', color: '#E74C3C' },
    orange: { bg: '#FFE8D4', color: '#C8633A' },
  }
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
      {badge && (
        <span
          className="text-[11px] font-bold px-2 py-1 rounded-full mr-1"
          style={badgeColors[badgeColor]}
        >
          {badge}
        </span>
      )}
      <ChevronRight size={16} color="#B5A696" />
    </button>
  )
}

export default function ProfilePage() {
  const { user, emergencyContact } = useUserStore()
  const stats = user?.stats

  const maskedPhone = emergencyContact?.phone
    ? emergencyContact.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    : ''

  return (
    <div className="page-container" style={{ background: '#FAF7F2' }}>
      {/* Header */}
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

        {/* Stats */}
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

      {/* Footprint card */}
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
            已点亮 {stats?.cityCount} 座城市
          </p>
        </div>
        <ChevronRight size={16} color="#B5A696" />
      </div>

      {/* Safety section */}
      <div className="mx-4 mt-4 rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF' }}>
        <p className="text-[13px] font-bold px-4 pt-3 pb-2" style={{ color: '#B5A696' }}>安全设置</p>
        <SettingRow
          icon="🆘"
          iconBg="#FFE4E4"
          title="紧急联系人"
          sub={emergencyContact ? `${emergencyContact.name} · ${maskedPhone}` : '未设置'}
          badge={emergencyContact ? '已设置' : '未设置'}
          badgeColor={emergencyContact ? 'green' : 'red'}
        />
        <SettingRow
          icon="📍"
          iconBg="#FFE8D4"
          title="位置共享"
          sub="实时共享给家人"
          badge="开启中"
          badgeColor="green"
        />
      </div>

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
          className="w-full py-4 rounded-2xl text-[15px] font-semibold"
          style={{ background: '#FFE4E4', color: '#E74C3C' }}
        >
          退出登录
        </button>
      </div>
    </div>
  )
}
