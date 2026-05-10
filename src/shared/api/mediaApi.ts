import api from './client'

export const mediaApi = {
  upload: (formData: FormData) =>
    api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getByTrip: (tripId: string) => api.get(`/media/trip/${tripId}`),
  generateVideo: (tripId: string, style: string) =>
    api.post('/media/generate-video', { tripId, style }),
  getVideoStatus: (videoId: string) =>
    api.get(`/media/video-status/${videoId}`),
}
