import authApi from '@/api/authApi'
import userApi from '@/api/userApi'
import { removeToken, setToken } from '@/plugins/http'

export default {
  async register({ commit }, payload) {
    try {
      const res = await authApi.register(payload)
      const { data } = res.data
      const { token_type, access_token, user } = data

      const token = `${token_type} ${access_token}`

      // Set http token.
      setToken(token)

      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      commit('SET_LOGGED_IN', true)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async login({ commit }, payload) {
    try {
      const res = await authApi.login(payload)
      const { data } = res.data
      const { token_type, access_token, user } = data

      const token = `${token_type} ${access_token}`

      // Set http token.
      setToken(token)

      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      commit('SET_LOGGED_IN', true)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async me({ commit }) {
    try {
      const res = await authApi.me()
      const { data } = res.data

      // Commits.
      commit('SET_USER', data)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async updateUserSettings({ commit }, payload) {
    try {
      const res = await userApi.updateSettings(payload)
      const { data } = res.data

      commit('SET_USER_SETTINGS', data)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async logout({ commit }) {
    try {
      const res = await authApi.logout()

      // Remove http token.
      removeToken()

      // Commits.
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
      commit('SET_LOGGED_IN', false)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
