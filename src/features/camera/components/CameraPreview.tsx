import { Camera } from 'lucide-react'

interface Props {
  cameraActive: boolean
  videoRef: React.RefObject<HTMLVideoElement | null>
  lastPhoto: string | null
}

export default function CameraPreview({ cameraActive, videoRef, lastPhoto }: Props) {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{ height: '60vw', maxHeight: 320, background: '#2A2A2A' }}
    >
      {cameraActive ? (
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <Camera size={48} color="rgba(255,255,255,0.3)" />
          <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>点击下方开启相机</p>
        </div>
      )}
      {lastPhoto && (
        <div className="absolute bottom-3 right-3 w-16 h-16 rounded-xl overflow-hidden border-2 border-white">
          <img src={lastPhoto} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}
