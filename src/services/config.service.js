import { api } from './api'

export const ConfigService = {
  async fetchUsers() {
    const response = await api.get('/users')
    return response.data.data
  },

  async fetchProfiles() {
    const response = await api.get('/profiles')
    const profilesData = response.data.data
    return profilesData.map(profile => ({
      id: profile.id,
      name: profile.name,
      count: 0,
      permissions: profile.permissions.map(permission => permission.name),
      permissionIds: profile.permissions.map(permission => permission.id)
    }))
  },

  async createProfile(name, permissions) {
    const response = await api.post('/profiles', {
      name,
      permissions: permissions
    })
    return response.data
  },

  async updateProfile(profileId, name, permissions) {
    const response = await api.put(`/profiles/${profileId}`, {
      name,
      permissions: permissions
    })
    return response.data
  },

  async createUser(userData) {
    const response = await api.post('/users', {
      name: userData.name,
      email: userData.email,
      profile_id: userData.profileId
    })
    return response.data
  },

  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, {
      name: userData.name,
      email: userData.email,
      profile_id: userData.profileId
    })
    return response.data
  }
} 