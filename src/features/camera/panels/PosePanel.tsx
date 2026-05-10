import { POSES, type Pose } from '../hooks/usePose'

interface Props {
  isOpen: boolean
  selectedPoseId: string
  onSelect: (pose: Pose) => void
  onClose: () => void
}

export default function PosePanel({ isOpen, selectedPoseId, onSelect, onClose }: Props) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-24"
        style={{ background: 'rgba(0,0,0,0.3)' }}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="panel-slide-up absolute bottom-0 left-0 right-0 z-25 rounded-t-3xl p-5"
        style={{ background: '#1C1C1E' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-4">
          <div
            className="rounded-full"
            style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.2)' }}
          />
        </div>

        <h3 className="text-[16px] font-bold text-white mb-1">选一个好看的姿势</h3>
        <p className="text-[12px] mb-4" style={{ color: 'rgba(255,255,255,0.42)' }}>
          对准虚线，AI 帮您拍出大片效果
        </p>

        {/* Pose grid - 3 columns */}
        <div className="grid grid-cols-3 gap-2.5">
          {POSES.map((pose) => {
            const isSelected = pose.id === selectedPoseId
            return (
              <button
                key={pose.id}
                onClick={() => onSelect(pose)}
                className="flex flex-col items-center p-3 rounded-2xl transition-all"
                style={{
                  background: isSelected ? 'rgba(200,99,58,0.2)' : 'rgba(255,255,255,0.05)',
                  border: isSelected ? '2px solid #C8633A' : '2px solid transparent',
                }}
              >
                {/* Mini SVG preview */}
                <svg viewBox="0 0 130 290" fill="none" style={{ width: 40, height: 90 }}>
                  <path
                    d={pose.svgPath}
                    stroke={isSelected ? '#C8633A' : 'rgba(255,255,255,0.6)'}
                    strokeWidth={2.5}
                    strokeDasharray="7 5"
                  />
                </svg>
                <span
                  className="text-[11px] font-semibold mt-2"
                  style={{ color: isSelected ? '#C8633A' : 'rgba(255,255,255,0.7)' }}
                >
                  {pose.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
