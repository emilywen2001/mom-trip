import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.msg || '网络不太好，请稍后再试'
    return Promise.reject(new Error(msg))
  }
)

export default api

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

export const mediaApi = {
  upload: (formData: FormData) =>
    api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getByTrip: (tripId: string) => api.get(`/media/trip/${tripId}`),
}

export const assistantApi = {
  chat: async (
    message: string,
    context: { currentCity?: string; tripId?: string; currentDay?: number },
    history: { role: string; content: string }[],
    onDelta: (delta: string) => void
  ) => {
    const response = await fetch('/api/v1/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, history }),
    })
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let full = ''
    while (reader) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.delta) { onDelta(data.delta); full += data.delta }
          } catch { /* ignore */ }
        }
      }
    }
    return full
  },
}

export const explainApi = {
  byImage: (formData: FormData) =>
    api.post('/explain/by-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
