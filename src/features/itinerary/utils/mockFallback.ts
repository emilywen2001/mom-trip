import { MOCK_TRIP } from '@/shared/mocks/mockTrip'
import type { Trip } from '@/shared/types/trip'

export const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export function buildMockTrip(
  destination: string,
  days: number,
  groupType: string,
  memberCount: number,
): Trip {
  const cappedDays = Math.min(days, MOCK_TRIP.itineraries.length)
  return {
    ...MOCK_TRIP,
    id: `t_${Date.now()}`,
    title: `${destination} ${days}日游`,
    destination,
    totalDays: days,
    groupType: groupType as Trip['groupType'],
    memberCount,
    status: 'ongoing',
    itineraries: MOCK_TRIP.itineraries.slice(0, cappedDays).map((d, i) => ({
      ...d,
      id: `d_${Date.now()}_${i}`,
    })),
  }
}
