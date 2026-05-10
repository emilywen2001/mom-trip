import { FILTERS, type Filter } from '../hooks/useFilter'

interface Props {
  isOpen: boolean
  selectedFilterId: string
  filterIntensity: number
  onSelectFilter: (filter: Filter) => void
  onIntensityChange: (value: number) => void
  onClose: () => void
}

export default function FilterPanel({
  isOpen, selectedFilterId, filterIntensity, onSelectFilter, onIntensityChange, onClose,
}: Props) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="absolute inset-0 z-24"
        style={{ background: 'rgba(0,0,0,0.3)' }}
        onClick={onClose}
      />
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

        <h3 className="text-[16px] font-bold text-white mb-1">选个好看的滤镜</h3>
        <p className="text-[12px] mb-4" style={{ color: 'rgba(255,255,255,0.42)' }}>
          专为妈妈肤质优化，实时预览效果
        </p>

        {/* Filter horizontal list */}
        <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar mb-4">
          {FILTERS.map((filter) => {
            const isSelected = filter.id === selectedFilterId
            return (
              <button
                key={filter.id}
                onClick={() => onSelectFilter(filter)}
                className="flex flex-col items-center flex-shrink-0"
                style={{ minWidth: 66 }}
              >
                <div
                  className="rounded-xl mb-1.5 flex items-center justify-center"
                  style={{
                    width: 66,
                    height: 80,
                    background: filter.previewColor,
                    border: isSelected ? '2.5px solid #C8633A' : '2.5px solid transparent',
                    borderRadius: 14,
                  }}
                >
                  <span className="text-[28px]">{filter.emoji}</span>
                </div>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: isSelected ? '#C8633A' : 'rgba(255,255,255,0.7)' }}
                >
                  {filter.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Intensity slider */}
        <div className="flex items-center gap-3 px-1">
          <span className="text-[12px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
            效果强度
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={filterIntensity}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            className="flex-1 camera-range"
          />
        </div>
      </div>
    </>
  )
}
