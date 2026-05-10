export interface User {
  id: string
  name: string
  phone?: string
  avatarUrl?: string
  stats?: {
    tripCount: number
    cityCount: number
    photoCount: number
    videoCount: number
  }
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relation: string
}
