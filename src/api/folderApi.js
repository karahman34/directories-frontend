import { http } from '@/plugins/http'

const prefix = '/folders'

export default {
  getRoot() {
    return http.get(`${prefix}/root`)
  },
  getDetail(folderId) {
    return http.get(`${prefix}/${folderId}`)
  },
  store(payload) {
    return http.post(`${prefix}`, payload)
  },
  update(folderId, payload) {
    return http.patch(`${prefix}/${folderId}`, payload)
  },
  delete(folderId) {
    return http.delete(`${prefix}/${folderId}`)
  },
  copy(folderId, payload) {
    return http.post(`${prefix}/${folderId}/copy`, payload)
  },
  move(folderId, payload) {
    return http.post(`${prefix}/${folderId}/move`, payload)
  },
  softDelete(folderId) {
    return http.delete(`${prefix}/${folderId}/soft`)
  },
  restore(folderId) {
    return http.patch(`${prefix}/${folderId}/restore`)
  },
}
