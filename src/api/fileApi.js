import { http } from '@/plugins/http'

const prefix = '/files'

export default {
  store(payload) {
    return http.post(`${prefix}`, payload)
  },
  copy(fileId, payload) {
    return http.post(`${prefix}/${fileId}/copy`, payload)
  },
  move(fileId, payload) {
    return http.post(`${prefix}/${fileId}/move`, payload)
  },
  delete(fileId) {
    return http.delete(`${prefix}/${fileId}`)
  },
}
