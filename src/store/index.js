import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    snackbar: {
      text: null,
      color: null,
    },
  },
  mutations: {
    SET_SNACKBAR(state, { text, color }) {
      state.snackbar.text = text
      state.snackbar.color = color
    },
  },
  actions: {},
  modules: {
    auth,
  },
})
