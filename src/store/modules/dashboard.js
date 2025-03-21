import { DashboardService } from '@/services/dashboard.service'

export default {
  namespaced: true,

  state: {
    stats: {},
    feedbacks: [],
    features: [],
    loading: true,
    error: null
  },

  getters: {
    stats: state => state.stats,
    feedbacks: state => state.feedbacks,
    features: state => state.features,
    loading: state => state.loading,
    error: state => state.error
  },

  mutations: {
    SET_STATS(state, stats) {
      state.stats = stats
    },
    SET_FEEDBACKS(state, feedbacks) {
      state.feedbacks = feedbacks
    },
    SET_FEATURES(state, features) {
      state.features = features
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    async fetchDashboardData({ commit, dispatch }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        await Promise.all([
          dispatch('fetchStats'),
          dispatch('fetchFeedbacks'),
          dispatch('fetchFeatures')
        ])
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
        commit('SET_ERROR', 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.')
      } finally {
        setTimeout(() => {
          commit('SET_LOADING', false)
        }, 500)
      }
    },

    async fetchStats({ commit }) {
      try {
        const stats = await DashboardService.fetchStats()
        commit('SET_STATS', stats)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
        throw error
      }
    },

    async fetchFeedbacks({ commit }) {
      try {
        const feedbacks = await DashboardService.fetchFeedbacks()
        commit('SET_FEEDBACKS', feedbacks)
      } catch (error) {
        console.error('Erro ao carregar feedbacks:', error)
        throw error
      }
    },

    async fetchFeatures({ commit }) {
      try {
        const features = await DashboardService.fetchFeatures()
        commit('SET_FEATURES', features)
      } catch (error) {
        console.error('Erro ao carregar funcionalidades:', error)
        throw error
      }
    }
  }
} 