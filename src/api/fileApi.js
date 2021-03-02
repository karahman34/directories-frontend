import { http } from '@/plugins/http'

const prefix = '/files'

export default {
  store(payload) {
    return http.post(`${prefix}`, payload)
  },
  delete(fileId) {
    return http.delete(`${prefix}/${fileId}`)
  },
}
