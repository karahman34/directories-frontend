import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import storage from './modules/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menus: [
      {
        text: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: { name: 'Dashboard' },
      },
      {
        text: 'Drive',
        icon: 'mdi-cloud',
        to: { name: 'Drive' },
      },
      {
        text: 'Trash',
        icon: 'mdi-trash-can',
        to: { name: 'Trash' },
      },
      {
        text: 'Settings',
        icon: 'mdi-cog',
        to: { name: 'Settings' },
      },
    ],
    snackbar: {
      text: null,
      color: null,
    },
    overlay: {
      show: false,
      text: null,
    },
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
    storage,
  },
})
