import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import useMiddleware from './helpers/useMiddleware'
import http, { checkToken, removeToken } from './plugins/http'

import '@mdi/font/css/materialdesignicons.min.css'

Vue.config.productionTip = false
Vue.use(http)

function runApp() {
  // Use Route Middleware.
  useMiddleware(router, store)

  // Initialize Vue App
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app')
}

const token = checkToken()
if (!token) {
  runApp()
} else {
  store
    .dispatch('auth/me')
    .then(() => {
      store.commit('auth/SET_TOKEN', token)
      store.commit('auth/SET_LOGGED_IN', true)

      runApp()
    })
    .catch(() => {
      removeToken()

      runApp()
    })
}
