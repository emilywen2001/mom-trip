import { Camera, SwitchCamera } from 'lucide-react'

type CameraMode = 'photo' | 'video'

interface Props {
  mode: CameraMode
  onModeChange: (mode: CameraMode) => void
  onCapture: () => void
  onFlip: () => void
  lastPhoto: string | null
  uploading: boolean
}

export default function BottomControls({
  mode, onModeChange, onCapture, onFlip, lastPhoto, uploading,
}: Props) {
  return (
    <div
      className="absolute left-0 right-0 z-20"
      style={{
        bottom: 'calc(90px + env(safe-area-inset-bottom))',
      }}
    >
      {/* Mode tabs */}
      <div className="flex justify-center gap-6 mb-4">
        {(['photo', 'video'] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className="relative pb-1.5"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span
              className="text-[14px] font-semibold"
              style={{ color: mode === m ? '#fff' : 'rgba(255,255,255,0.5)' }}
            >
              {m === 'photo' ? '拍照' : '视频'}
            </span>
            {mode === m && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full"
                style={{ width: 20, background: '#C8633A' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Shutter row */}
      <div className="flex items-center justify-center gap-8 px-6">
        {/* Left: Album thumbnail */}
        <button
          className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 touchable"
          style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}
        >
          {lastPhoto ? (
            <img src={lastPhoto} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera size={20} color="rgba(255,255,255,0.4)" />
            </div>
          )}
        </button>

        {/* Center: Shutter button */}
        <button
          onClick={onCapture}
          disabled={uploading}
          className="shutter-btn rounded-full flex items-center justify-center touchable"
          style={{
            width: 76,
            height: 76,
            background: mode === 'video' ? 'transparent' : '#fff',
            border: mode === 'video'
              ? '4px solid rgba(255,255,255,0.8)'
              : '4px solid rgba(255,255,255,0.4)',
            padding: 0,
          }}
        >
          {uploading ? (
            <div className="w-8 h-8 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
          ) : mode === 'video' ? (
            <div
              className="rounded-md"
              style={{ width: 30, height: 30, background: '#E74C3C' }}
            />
          ) : (
            <div />
          )}
        </button>

        {/* Right: Flip camera */}
        <button
          onClick={onFlip}
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 touchable"
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none' }}
        >
          <SwitchCamera size={24} color="rgba(255,255,255,0.8)" />
        </button>
      </div>
    </div>
  )
}
