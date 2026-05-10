import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  fontSize: 'normal' | 'large' | 'xlarge'
  activeTab: 'home' | 'itinerary' | 'camera' | 'assistant' | 'profile'
  setActiveTab: (tab: UIStore['activeTab']) => void
  setFontSize: (size: UIStore['fontSize']) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      fontSize: 'large',
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      setFontSize: (size) => set({ fontSize: size }),
    }),
    { name: 'ui-store' }
  )
)

export const fontScales = {
  normal: 1.0,
  large: 1.15,
  xlarge: 1.3,
}
