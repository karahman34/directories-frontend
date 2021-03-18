import { http } from '@/plugins/http'

const prefix = '/files'

export default {
  show(fileId) {
    return http.get(`${prefix}/${fileId}`)
  },
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
  softDelete(fileId) {
    return http.delete(`${prefix}/${fileId}/soft`)
  },
  updateVisibility(fileId, payload) {
    return http.post(`${prefix}/${fileId}/visibility`, payload)
  },
  restore(fileId) {
    return http.patch(`${prefix}/${fileId}/restore`)
  },
}
