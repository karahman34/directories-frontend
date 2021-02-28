export default {
  install: (Vue, store) => {
    Vue.prototype.$overlay = {
      show: () => {
        store.commit('SET_OVERLAY', true)
      },
      hide: () => {
        store.commit('SET_OVERLAY', false)
      },
    }
  },
}
