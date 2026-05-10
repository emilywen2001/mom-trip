export interface Media {
  id: string
  tripId: string
  fileUrl: string
  thumbUrl?: string
  mediaType: 'photo' | 'video'
  latitude?: number
  longitude?: number
  placeName?: string
  voiceNote?: string
  takenAt: string
}
