export default {
  install: (Vue, store) => {
    if (!store) {
      throw new Error('Please provide vuex store.')
    }

    Vue.prototype.$snackbar = {
      show: ({ text = '', color = '' }) => {
        store.commit('SET_SNACKBAR', { text, color })
      },
      hide: () => {
        store.commit('SET_SNACKBAR', {
          text: null,
          color: null,
        })
      },
    }
  },
}
