import api from './client'

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateEmergencyContact: (data: { name: string; phone: string; relation: string }) =>
    api.put('/users/emergency-contact', data),
}
