import { useTripStore } from '@/shared/store/useTripStore'
import RunningTripPanel from '../components/RunningTripPanel'
import GuideParserCard from '../components/GuideParserCard'
import PlanningPanel from '../components/PlanningPanel'

export default function ItineraryPage() {
  const { currentTrip } = useTripStore()

  if (currentTrip) {
    return (
      <div className="page-container">
        <RunningTripPanel />
      </div>
    )
  }

  return (
    <div className="page-container px-4 pt-12" style={{ background: '#FAF7F2' }}>
      <h1 className="text-[20px] font-bold mb-6" style={{ color: '#2D2A26' }}>规划旅行 ✈️</h1>
      <GuideParserCard />
      <PlanningPanel />
    </div>
  )
}
