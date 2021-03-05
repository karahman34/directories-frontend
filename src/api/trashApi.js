import { http } from '@/plugins/http'

const prefix = '/trash'

export default {
  index() {
    return http.get(`${prefix}`)
  },
  show(folderId) {
    return http.get(`${prefix}/${folderId}`)
  },
}
