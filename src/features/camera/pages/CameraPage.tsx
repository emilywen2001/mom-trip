import { useEffect, useState } from 'react'
import CameraPreview from '../components/CameraPreview'
import RightBar from '../components/RightBar'
import BottomControls from '../components/BottomControls'
import PosePanel from '../panels/PosePanel'
import FilterPanel from '../panels/FilterPanel'
import { useCamera } from '../hooks/useCamera'
import { usePose } from '../hooks/usePose'
import { useFilter } from '../hooks/useFilter'

type ActivePanel = 'pose' | 'filter' | null
type CameraMode = 'photo' | 'video'

export default function CameraPage() {
  const camera = useCamera()
  const pose = usePose()
  const filter = useFilter()
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [mode, setMode] = useState<CameraMode>('photo')

  // Auto-start camera on mount, cleanup on unmount
  useEffect(() => {
    camera.startCamera()
    return () => { camera.stopCamera() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleModeChange = (m: CameraMode) => {
    if (m === mode) return
    setMode(m)
    // 切到视频模式时关闭姿势引导
    if (m === 'video' && pose.isPoseActive) {
      pose.togglePose()
      setActivePanel(null)
    }
  }

  const togglePosePanel = () => {
    if (activePanel === 'pose') {
      setActivePanel(null)
      // deactivate pose overlay too
      if (pose.isPoseActive) pose.togglePose()
    } else {
      setActivePanel('pose')
      // activate pose overlay if not already
      if (!pose.isPoseActive) pose.togglePose()
    }
  }

  const toggleFilterPanel = () => {
    if (activePanel === 'filter') {
      setActivePanel(null)
    } else {
      setActivePanel('filter')
      // close pose if open
      if (pose.isPoseActive) pose.togglePose()
    }
  }

  return (
    <div className="fixed inset-0 z-10" style={{ background: '#000' }}>
      {/* Camera preview with all overlays */}
      <CameraPreview
        videoRef={camera.videoRef}
        cameraActive={camera.cameraActive}
        cssFilter={filter.computedCSSFilter}
        isPoseActive={pose.isPoseActive}
        selectedPose={pose.selectedPose}
        lastPhoto={camera.lastPhoto}
      />

      {/* Right function bar */}
      <RightBar
        isPoseActive={pose.isPoseActive}
        isFilterActive={activePanel === 'filter'}
        onTogglePose={togglePosePanel}
        onToggleFilter={toggleFilterPanel}
      />

      {/* Bottom controls */}
      <BottomControls
        mode={mode}
        onModeChange={handleModeChange}
        onCapture={camera.takePhoto}
        onFlip={camera.flipCamera}
        lastPhoto={camera.lastPhoto}
        uploading={camera.uploading}
      />

      {/* Pose selection panel */}
      <PosePanel
        isOpen={activePanel === 'pose'}
        selectedPoseId={pose.selectedPose.id}
        onSelect={pose.selectPose}
        onClose={() => { setActivePanel(null); if (pose.isPoseActive) pose.togglePose() }}
      />

      {/* Filter selection panel */}
      <FilterPanel
        isOpen={activePanel === 'filter'}
        selectedFilterId={filter.selectedFilter.id}
        filterIntensity={filter.filterIntensity}
        onSelectFilter={filter.selectFilter}
        onIntensityChange={filter.setFilterIntensity}
        onClose={() => setActivePanel(null)}
      />
    </div>
  )
}
