import { Routes, Route } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import BottomNav from '@/shared/components/BottomNav'

// Lazy load feature pages
import HomePage from '@/features/home/pages/HomePage'
import ItineraryPage from '@/features/itinerary/pages/ItineraryPage'
import CameraPage from '@/features/camera/pages/CameraPage'
import AssistantPage from '@/features/assistant/pages/AssistantPage'
import { VoiceCallPage, FloatingAssistant } from '@/features/assistant'
import ProfilePage from '@/features/profile/pages/ProfilePage'

export default function AppRouter() {
  return (
    <>
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100svh', background: '#FAF7F2' }}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ITINERARY} element={<ItineraryPage />} />
          <Route path={ROUTES.CAMERA} element={<CameraPage />} />
          <Route path={ROUTES.ASSISTANT} element={<AssistantPage />} />
          <Route path={ROUTES.VOICE_CALL} element={<VoiceCallPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Routes>
        <BottomNav />
        <FloatingAssistant />
      </div>
    </>
  )
}
