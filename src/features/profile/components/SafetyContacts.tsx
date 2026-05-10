import { ChevronRight } from 'lucide-react'
import { useUserStore } from '@/shared/store/useUserStore'

export default function SafetyContacts() {
  const { emergencyContact } = useUserStore()

  const maskedPhone = emergencyContact?.phone
    ? emergencyContact.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    : ''

  const badgeColors = {
    green: { bg: '#E2F0E8', color: '#4A8C5C' },
    red: { bg: '#FFE4E4', color: '#E74C3C' },
  }

  const hasContact = !!emergencyContact

  return (
    <div className="mx-4 mt-4 rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF' }}>
      <p className="text-[13px] font-bold px-4 pt-3 pb-2" style={{ color: '#B5A696' }}>安全设置</p>

      <button
        className="flex items-center gap-3 px-4 py-4 w-full text-left touchable"
        style={{ borderBottom: '1px solid #F0EBE3' }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0" style={{ background: '#FFE4E4' }}>
          🆘
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-semibold" style={{ color: '#2D2A26' }}>紧急联系人</p>
          <p className="text-[12px] mt-0.5" style={{ color: '#B5A696' }}>
            {hasContact ? `${emergencyContact.name} · ${maskedPhone}` : '未设置'}
          </p>
        </div>
        <span
          className="text-[11px] font-bold px-2 py-1 rounded-full mr-1"
          style={hasContact ? badgeColors.green : badgeColors.red}
        >
          {hasContact ? '已设置' : '未设置'}
        </span>
        <ChevronRight size={16} color="#B5A696" />
      </button>

      <button
        className="flex items-center gap-3 px-4 py-4 w-full text-left touchable"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0" style={{ background: '#FFE8D4' }}>
          📍
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-semibold" style={{ color: '#2D2A26' }}>位置共享</p>
          <p className="text-[12px] mt-0.5" style={{ color: '#B5A696' }}>实时共享给家人</p>
        </div>
        <span
          className="text-[11px] font-bold px-2 py-1 rounded-full mr-1"
          style={badgeColors.green}
        >
          开启中
        </span>
        <ChevronRight size={16} color="#B5A696" />
      </button>
    </div>
  )
}
