interface Props {
  isPoseActive: boolean
  isFilterActive: boolean
  onTogglePose: () => void
  onToggleFilter: () => void
}

export default function RightBar({ isPoseActive, isFilterActive, onTogglePose, onToggleFilter }: Props) {
  const btnBase: React.CSSProperties = {
    width: 52,
    height: 52,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
  }

  return (
    <div
      className="absolute right-3 z-10"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      {/* Filter button */}
      <button
        onClick={onToggleFilter}
        style={{
          ...btnBase,
          background: isFilterActive ? 'rgba(200,99,58,0.9)' : 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <span className="text-[20px]">✨</span>
        <span
          className="text-[10px] font-semibold mt-0.5"
          style={{ color: isFilterActive ? '#fff' : 'rgba(255,255,255,0.7)' }}
        >
          滤镜
        </span>
      </button>

      {/* Pose button */}
      <button
        onClick={onTogglePose}
        style={{
          ...btnBase,
          background: isPoseActive ? 'rgba(200,99,58,0.9)' : 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <span className="text-[20px]">🧍</span>
        <span
          className="text-[10px] font-semibold mt-0.5"
          style={{ color: isPoseActive ? '#fff' : 'rgba(255,255,255,0.7)' }}
        >
          姿势
        </span>
      </button>
    </div>
  )
}
