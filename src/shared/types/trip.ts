export interface Trip {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  totalDays: number
  groupType: 'sisters' | 'family' | 'solo' | 'couple'
  memberCount: number
  status: 'upcoming' | 'ongoing' | 'finished'
  itineraries: DayItinerary[]
  coverThumb?: string
}

export interface DayItinerary {
  id: string
  dayIndex: number
  date: string
  theme: string
  items: ItineraryItem[]
  weather?: WeatherInfo
  outfit?: OutfitSuggestion
}

export interface ItineraryItem {
  id: string
  time: string
  title: string
  description: string
  type: 'attraction' | 'meal' | 'transport' | 'hotel'
  address?: string
  latitude?: number
  longitude?: number
  isBooked: boolean
  tags: string[]
}

export interface WeatherInfo {
  city: string
  date: string
  tempHigh: number
  tempLow: number
  condition: string
  conditionIcon: string
  suggestion: string
}

export interface OutfitSuggestion {
  theme: string
  colorHex: string
  emojiIcons: string[]
  description: string
  photoTip: string
  items: { category: string; suggestion: string }[]
}
