import { http } from '@/plugins/http'

const prefix = '/user'

export default {
  getStorage() {
    return http.get(`${prefix}/storage`)
  },
  getRecentUploads() {
    return http.get(`${prefix}/recent-uploads`)
  },
  search(params = null) {
    return http.get(`${prefix}/search`, { params })
  },
}
