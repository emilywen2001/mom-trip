import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, EmergencyContact } from '../types/trip'
import { MOCK_USER, MOCK_EMERGENCY_CONTACT } from '../services/mockData'

interface UserStore {
  user: User | null
  emergencyContact: EmergencyContact | null
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  setEmergencyContact: (contact: EmergencyContact) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: MOCK_USER,
      emergencyContact: MOCK_EMERGENCY_CONTACT,
      isLoggedIn: true,
      login: () => set({ user: MOCK_USER, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      setEmergencyContact: (contact) => set({ emergencyContact: contact }),
    }),
    { name: 'user-store' }
  )
)
