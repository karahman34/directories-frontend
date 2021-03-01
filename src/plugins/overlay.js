export default {
  install: (Vue, store) => {
    Vue.prototype.$overlay = {
      show: (text = '') => {
        store.commit('SET_OVERLAY', {
          show: true,
          text,
        })
      },
      hide: () => {
        store.commit('SET_OVERLAY', {
          show: false,
          text: null,
        })
      },
    }
  },
}
