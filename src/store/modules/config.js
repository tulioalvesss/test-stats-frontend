import { ConfigService } from '@/services/config.service'

export default {
  namespaced: true,

  state: {
    users: [],
    profiles: [],
    loading: false,
    error: null,
    currentProfile: null,
    currentUser: null
  },

  getters: {
    users: state => state.users,
    profiles: state => state.profiles,
    loading: state => state.loading,
    error: state => state.error,
    currentProfile: state => state.currentProfile,
    currentUser: state => state.currentUser
  },

  mutations: {
    SET_USERS(state, users) {
      state.users = users
    },
    SET_PROFILES(state, profiles) {
      state.profiles = profiles
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_CURRENT_PROFILE(state, profile) {
      state.currentProfile = profile
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user
    },
    ADD_USER(state, user) {
      state.users.push(user)
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(u => u.id === updatedUser.id)
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser)
      }
    },
    ADD_PROFILE(state, profile) {
      state.profiles.push(profile)
    },
    UPDATE_PROFILE(state, updatedProfile) {
      const index = state.profiles.findIndex(p => p.id === updatedProfile.id)
      if (index !== -1) {
        state.profiles.splice(index, 1, updatedProfile)
      }
    },
    UPDATE_PROFILE_COUNT(state, { profileId, increment }) {
      const profile = state.profiles.find(p => p.id === profileId)
      if (profile) {
        profile.count += increment ? 1 : -1
      }
    }
  },

  actions: {
    async fetchData({ dispatch, commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      try {
        await Promise.all([
          dispatch('fetchUsers'),
          dispatch('fetchProfiles')
        ])
      } catch (error) {
        commit('SET_ERROR', 'Erro ao carregar dados. Por favor, tente novamente.')
        console.error('Erro ao carregar dados:', error)
      } finally {
        setTimeout(() => {
          commit('SET_LOADING', false)
        }, 500)
      }
    },

    async fetchUsers({ commit }) {
      try {
        const users = await ConfigService.fetchUsers()
        commit('SET_USERS', users)
      } catch (error) {
        console.error('Erro ao carregar usuários:', error)
        throw error
      }
    },

    async fetchProfiles({ commit, state }) {
      try {
        const profiles = await ConfigService.fetchProfiles()
        
        // Atualizar contagem de usuários por perfil
        profiles.forEach(profile => {
          profile.count = state.users.filter(user => user.profile.id === profile.id).length
        })
        
        commit('SET_PROFILES', profiles)
      } catch (error) {
        console.error('Erro ao carregar perfis:', error)
        throw error
      }
    },

    async createProfile({ commit }, { name, permissions }) {
      try {
        const response = await ConfigService.createProfile(name, permissions)
        
        const newProfile = {
          id: response.id,
          name,
          count: 0,
          permissions: permissions.map(id => {
            switch(id) {
              case 1: return 'Downloads'
              case 2: return 'Avaliações'
              case 3: return 'Erros'
              case 4: return 'Feedbacks'
              case 5: return 'Novas Funcionalidades'
              default: return ''
            }
          }),
          permissionIds: permissions
        }

        commit('ADD_PROFILE', newProfile)
        return newProfile
      } catch (error) {
        console.error('Erro ao criar perfil:', error)
        throw error
      }
    },

    async updateProfile({ commit }, { profileId, name, permissions }) {
      try {
        await ConfigService.updateProfile(profileId, name, permissions)
        
        const updatedProfile = {
          id: profileId,
          name,
          permissions: permissions.map(id => {
            switch(id) {
              case 1: return 'Downloads'
              case 2: return 'Avaliações'
              case 3: return 'Erros'
              case 4: return 'Feedbacks'
              case 5: return 'Novas Funcionalidades'
              default: return ''
            }
          }),
          permissionIds: permissions
        }

        commit('UPDATE_PROFILE', updatedProfile)
        return updatedProfile
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        throw error
      }
    },

    async createUser({ commit }, userData) {
      try {
        const response = await ConfigService.createUser(userData)
        
        const newUser = {
          id: response.id,
          name: userData.name,
          email: userData.email,
          profile: {
            id: userData.profileId,
            name: userData.profileName
          },
          active: true
        }

        commit('ADD_USER', newUser)
        commit('UPDATE_PROFILE_COUNT', { profileId: userData.profileId, increment: true })
        return newUser
      } catch (error) {
        console.error('Erro ao criar usuário:', error)
        throw error
      }
    },

    async updateUser({ commit, state }, { userId, userData }) {
      try {
        await ConfigService.updateUser(userId, userData)
        
        const oldUser = state.users.find(u => u.id === userId)
        const updatedUser = {
          ...oldUser,
          name: userData.name,
          email: userData.email,
          profile: {
            id: userData.profileId,
            name: userData.profileName
          }
        }

        if (oldUser.profile.id !== userData.profileId) {
          commit('UPDATE_PROFILE_COUNT', { profileId: oldUser.profile.id, increment: false })
          commit('UPDATE_PROFILE_COUNT', { profileId: userData.profileId, increment: true })
        }

        commit('UPDATE_USER', updatedUser)
        return updatedUser
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error)
        throw error
      }
    }
  }
} 