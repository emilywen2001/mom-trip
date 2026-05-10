import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BottomNav from './components/ui/BottomNav'
import HomePage from './pages/Home'
import ItineraryPage from './pages/Itinerary'
import CameraPage from './pages/Camera'
import AssistantPage from './pages/Assistant'
import ProfilePage from './pages/Profile'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100svh', background: '#FAF7F2' }}>
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/itinerary"  element={<ItineraryPage />} />
            <Route path="/camera"     element={<CameraPage />} />
            <Route path="/assistant"  element={<AssistantPage />} />
            <Route path="/profile"    element={<ProfilePage />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
