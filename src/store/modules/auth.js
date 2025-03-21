import { AuthService } from '@/services/auth.service'

export default {
  namespaced: true,
  
  state: {
    token: localStorage.getItem('token') || null,
    userType: localStorage.getItem('TypeUser') || null,
    error: null,
    loading: false
  },

  getters: {
    isAuthenticated: state => !!state.token,
    userType: state => state.userType,
    error: state => state.error,
    isLoading: state => state.loading
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER_TYPE(state, type) {
      state.userType = type
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    CLEAR_AUTH(state) {
      state.token = null
      state.userType = null
      state.error = null
    }
  },

  actions: {
    async login({ commit }, { email, password }) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        const { token, user } = await AuthService.login(email, password)
        
        AuthService.setUserData(token, user.profile.name)
        commit('SET_TOKEN', token)
        commit('SET_USER_TYPE', user.profile.name)
        
        return true
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erro ao fazer login. Tente novamente.'
        commit('SET_ERROR', errorMessage)
        return false
      } finally {
        commit('SET_LOADING', false)
      }
    },

    logout({ commit }) {
      AuthService.clearUserData()
      commit('CLEAR_AUTH')
    }
  }
} 