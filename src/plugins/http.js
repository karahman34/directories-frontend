import Axios from 'axios'

const tokenName = 'auth.token'

const http = Axios.create({
  baseURL: process.env.VUE_APP_API_URL,
})

function checkToken() {
  const token = localStorage.getItem(tokenName)

  if (token) {
    http.defaults.headers['Authorization'] = token
  }

  return token
}

function setToken(token) {
  http.defaults.headers['Authorization'] = token

  localStorage.setItem(tokenName, token)
}

function removeToken() {
  delete http.defaults.headers['Authorization']

  localStorage.removeItem(tokenName)
}

export { http, checkToken, tokenName, setToken, removeToken }

export default {
  install: Vue => {
    Vue.prototype.$http = http
  },
}
