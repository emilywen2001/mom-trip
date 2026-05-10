export const ROUTES = {
  HOME: '/',
  ITINERARY: '/itinerary',
  CAMERA: '/camera',
  ASSISTANT: '/assistant',
  PROFILE: '/profile',
  VOICE_CALL: '/assistant/voice',
} as const

export type RouteKey = keyof typeof ROUTES
