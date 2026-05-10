import api from './client'

export const planApi = {
  generate: (params: {
    destination: string
    days: number
    groupType: string
    memberCount: number
    preferences: string[]
  }) => api.post('/plan/generate', params),

  parseLink: (content: string) =>
    api.post('/plan/parse-link', { content, contentType: 'text' }),
}

export const outfitApi = {
  suggest: (params: {
    tripId: string
    dayIndex: number
    destination: string
    date: string
    weather: { condition: string; tempHigh: number; tempLow: number }
    dayActivities: string[]
    groupType: string
  }) => api.post('/outfit/suggest', params),
}

export const weatherApi = {
  forecast: (city: string, days = 7) =>
    api.get(`/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`),
}
