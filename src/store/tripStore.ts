import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Trip, DayItinerary } from '../types/trip'
import { MOCK_TRIP } from '../services/mockData'

interface TripStore {
  currentTrip: Trip | null
  trips: Trip[]
  selectedDayIndex: number
  setCurrentTrip: (trip: Trip) => void
  addTrip: (trip: Trip) => void
  setSelectedDay: (index: number) => void
  getCurrentDay: () => DayItinerary | null
}

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      currentTrip: MOCK_TRIP,
      trips: [MOCK_TRIP],
      selectedDayIndex: 2, // 默认显示第2天（进行中）
      setCurrentTrip: (trip) => set({ currentTrip: trip }),
      addTrip: (trip) => set((s) => ({ trips: [trip, ...s.trips], currentTrip: trip })),
      setSelectedDay: (index) => set({ selectedDayIndex: index }),
      getCurrentDay: () => {
        const { currentTrip, selectedDayIndex } = get()
        if (!currentTrip) return null
        return currentTrip.itineraries.find((d) => d.dayIndex === selectedDayIndex) ?? currentTrip.itineraries[0]
      },
    }),
    { name: 'trip-store' }
  )
)
