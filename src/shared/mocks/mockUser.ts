import type { User, EmergencyContact } from '@/shared/types/user'

export const MOCK_USER: User = {
  id: 'u_001',
  name: '王阿姨',
  phone: '138****8888',
  stats: { tripCount: 12, cityCount: 8, photoCount: 346, videoCount: 5 },
}

export const MOCK_EMERGENCY_CONTACT: EmergencyContact = {
  id: 'ec_001',
  name: '女儿',
  phone: '13900139000',
  relation: 'daughter',
}
