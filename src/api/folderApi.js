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
    return http.patch(`${prefix}/${folderId}`)
  },
}
