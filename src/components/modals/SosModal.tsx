import { Phone, X } from 'lucide-react'
import { useUserStore } from '../../store/userStore'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SosModal({ open, onClose }: Props) {
  const { emergencyContact } = useUserStore()

  if (!open) return null

  const maskedPhone = emergencyContact?.phone
    ? emergencyContact.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    : ''

  const handleCall = () => {
    if (emergencyContact) {
      window.location.href = `tel:${emergencyContact.phone}`
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full max-w-[480px] mx-auto rounded-t-3xl p-6 pb-10"
        style={{ background: '#FFF0EF' }}
      >
        {/* close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2">
          <X size={20} color="#7B6E65" />
        </button>

        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#E74C3C' }}
          >
            <Phone size={30} color="white" />
          </div>

          <h2 className="text-[22px] font-bold mb-2" style={{ color: '#2D2A26' }}>
            需要帮助吗？
          </h2>

          {emergencyContact ? (
            <>
              <p className="text-[15px] mb-1" style={{ color: '#7B6E65' }}>
                将联系您的家人
              </p>
              <p className="text-[17px] font-semibold mb-8" style={{ color: '#2D2A26' }}>
                {emergencyContact.name} · {maskedPhone}
              </p>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl text-[16px] font-semibold mb-3"
                style={{ background: '#F0EBE3', color: '#7B6E65' }}
              >
                我没事
              </button>
              <button
                onClick={handleCall}
                className="w-full py-4 rounded-2xl text-[16px] font-bold text-white"
                style={{ background: '#E74C3C' }}
              >
                立刻联系家人
              </button>
            </>
          ) : (
            <>
              <p className="text-[15px] mb-8" style={{ color: '#7B6E65' }}>
                请先在「我的」页设置紧急联系人
              </p>
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl text-[16px] font-semibold text-white"
                style={{ background: '#C8633A' }}
              >
                去设置
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
