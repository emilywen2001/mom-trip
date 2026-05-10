import { Camera } from 'lucide-react'

interface Props {
  cameraActive: boolean
  uploading: boolean
  onStart: () => void
  onCapture: () => void
}

export default function CaptureButton({ cameraActive, uploading, onStart, onCapture }: Props) {
  return (
    <div className="flex items-center justify-center gap-12 mt-8 px-8">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }} />

      <button
        onClick={cameraActive ? onCapture : onStart}
        className="w-20 h-20 rounded-full flex items-center justify-center touchable"
        style={{ background: 'white', border: '4px solid rgba(255,255,255,0.5)' }}
        disabled={uploading}
      >
        {uploading ? (
          <div className="w-8 h-8 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
        ) : cameraActive ? (
          <div className="w-14 h-14 rounded-full" style={{ background: '#C8633A' }} />
        ) : (
          <Camera size={28} color="#C8633A" />
        )}
      </button>

      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }} />
    </div>
  )
}
