import { useState } from 'react'
import { Phone } from 'lucide-react'
import SosModal from '../modals/SosModal'

export default function SosPill() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full touchable"
        style={{ background: 'rgba(231,76,60,0.15)', border: '1.5px solid #E74C3C' }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: '#E74C3C', animation: 'pulse-dot 1.5s ease-in-out infinite' }}
        />
        <Phone size={14} color="#E74C3C" />
        <span className="text-[13px] font-bold" style={{ color: '#E74C3C' }}>SOS</span>
      </button>
      <SosModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
