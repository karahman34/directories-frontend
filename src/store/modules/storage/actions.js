import folderApi from '@/api/folderApi'
import userApi from '@/api/userApi'
import { setDirectoryObject } from '@/helpers/storage'

export default {
  async getStorage({ commit }) {
    try {
      const res = await userApi.getStorage()
      const { data } = res.data
      const { space, used_space } = data

      commit('SET_SPACE', space)
      commit('SET_USED_SPACE', used_space)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async getRecentUploads({ commit }) {
    try {
      const res = await userApi.getRecentUploads()
      const { data } = res.data

      commit('SET_RECENT_UPLOADS', data)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async getRootDirectory({ commit }) {
    try {
      const res = await folderApi.getRoot()
      const { data } = res.data

      setDirectoryObject(data)

      commit('SET_ROOT', data)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
