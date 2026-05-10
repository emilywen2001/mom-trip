import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTripStore } from '@/shared/store/useTripStore'
import { ROUTES } from '@/shared/constants/routes'
import { MOCK_TRIP } from '@/shared/mocks/mockTrip'
import HeroHeader from '../components/HeroHeader'
import TodayWeatherCard from '../components/TodayWeatherCard'
import OutfitCard from '../components/OutfitCard'
import ItineraryCard from '../components/ItineraryCard'
import MemoryCard from '../components/MemoryCard'
import OutfitModal from '../components/OutfitModal'

export default function HomePage() {
  const navigate = useNavigate()
  const { currentTrip, selectedDayIndex } = useTripStore()
  const [outfitOpen, setOutfitOpen] = useState(false)

  // fallback to mock if persist cleared data
  const trip = currentTrip ?? MOCK_TRIP
  const today = trip.itineraries.find((d) => d.dayIndex === selectedDayIndex) ?? trip.itineraries[0]
  const currentDayIdx = today.dayIndex
  const totalDays = trip.totalDays

  return (
    <div className="page-container" style={{ background: '#FAF7F2' }}>
      {/* Hero Header */}
      <HeroHeader
        currentTrip={trip}
        currentDayIdx={currentDayIdx}
        totalDays={totalDays}
      />

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <TodayWeatherCard weather={today.weather} />
        <OutfitCard outfit={today.outfit} onClick={() => setOutfitOpen(true)} />
        <ItineraryCard
          items={today.items}
          onViewAll={() => navigate(ROUTES.ITINERARY)}
        />
        <MemoryCard
          onOpenCamera={() => navigate(ROUTES.CAMERA)}
          onViewAll={() => navigate(ROUTES.CAMERA)}
        />
      </div>

      {/* Outfit Modal */}
      <OutfitModal
        open={outfitOpen}
        onClose={() => setOutfitOpen(false)}
        outfit={today.outfit ?? null}
      />
    </div>
  )
}
