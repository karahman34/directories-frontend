import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menus: [
      {
        text: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: { name: 'Dashboard' },
      },
    ],
    snackbar: {
      text: null,
      color: null,
    },
    overlay: false,
  },
  mutations: {
    SET_SNACKBAR(state, { text, color }) {
      state.snackbar.text = text
      state.snackbar.color = color
    },
    SET_OVERLAY(state, value) {
      state.overlay = value
    },
  },
  actions: {},
  modules: {
    auth,
  },
})
