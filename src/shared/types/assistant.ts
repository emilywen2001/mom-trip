export type AIState = 'idle' | 'listening' | 'thinking' | 'speaking'

export interface DialogTurn {
  role: 'user' | 'ai'
  content: string
  status?: 'interim' | 'final'
  timestamp: number
}

export interface RecommendCard {
  emoji: string
  text: string
  question: string
}

export interface ParseRequest {
  platform: 'xiaohongshu'
  url: string
}

export interface ParsedItinerary {
  title: string
  days: Array<{
    day: number
    locations: Array<{
      name: string
      lat: number
      lng: number
      notes?: string
    }>
  }>
}

export interface ParseResponse {
  success: boolean
  itinerary?: ParsedItinerary
  error?: string
}
