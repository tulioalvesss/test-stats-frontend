import { createStore } from 'vuex'
import auth from './modules/auth'
import dashboard from './modules/dashboard'
import config from './modules/config'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    dashboard,
    config
  }
}) 