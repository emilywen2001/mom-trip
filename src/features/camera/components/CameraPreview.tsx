import type { RefObject } from 'react'
import type { Pose } from '../hooks/usePose'

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>
  cameraActive: boolean
  cssFilter: string
  isPoseActive: boolean
  selectedPose: Pose
  lastPhoto: string | null
}

export default function CameraPreview({
  videoRef, cameraActive, cssFilter, isPoseActive, selectedPose, lastPhoto,
}: Props) {
  return (
    <div className="relative w-full" style={{ height: '100svh', background: '#000' }}>
      {/* Layer 1: Camera feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          filter: cssFilter,
          transform: 'scaleX(-1)', // mirror for selfie feel
        }}
      />

      {/* Not active placeholder */}
      {!cameraActive && (
        <div
          className="flex flex-col items-center justify-center"
          style={{ position: 'absolute', inset: 0, zIndex: 2, background: '#1A1A1A' }}
        >
          <div className="text-[64px] mb-4">📷</div>
          <p className="text-[15px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            点击下方开启相机
          </p>
        </div>
      )}

      {/* Layer 2: Semi-transparent mask when pose active */}
      {isPoseActive && cameraActive && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 5,
            background: 'rgba(0, 0, 0, 0.28)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Layer 3: SVG pose guide */}
      {isPoseActive && cameraActive && (
        <svg
          viewBox="0 0 130 290"
          fill="none"
          className="pose-guide"
          style={{
            position: 'absolute',
            bottom: '140px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 6,
            width: '120px',
            height: '270px',
            pointerEvents: 'none',
          }}
        >
          <path
            d={selectedPose.svgPath}
            stroke="white"
            strokeWidth={2.5}
            strokeDasharray="7 5"
            opacity={0.9}
          />
        </svg>
      )}

      {/* Pose hint banner */}
      {isPoseActive && cameraActive && (
        <div
          style={{
            position: 'absolute', top: 60, left: '50%',
            transform: 'translateX(-50%)', zIndex: 15,
            background: 'rgba(0,0,0,0.52)',
            borderRadius: 20, padding: '8px 16px',
            display: 'flex', alignItems: 'center', gap: 7,
            backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
          }}
        >
          <div className="hint-dot" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
            {selectedPose.hint}
          </span>
        </div>
      )}

      {/* Last photo thumbnail */}
      {lastPhoto && (
        <div
          className="absolute bottom-28 left-5 w-14 h-14 rounded-xl overflow-hidden border-2 border-white/60 z-30"
        >
          <img src={lastPhoto} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}
