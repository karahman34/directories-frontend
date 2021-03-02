export default {
  SET_SPACE(state, space) {
    state.space = space
  },
  SET_USED_SPACE(state, usedSpace) {
    state.usedSpace = usedSpace
  },
  SET_RECENT_UPLOADS(state, files) {
    state.recentUploads = files
  },
  ADD_RECENT_UPLOADS(state, file) {
    state.recentUploads.unshift(file)
    state.usedSpace += file.size
  },
  ADD_RECENT_UPLOAD(state, file) {
    state.recentUploads.push(file)
  },
  SET_ROOT(state, root) {
    state.root = root
  },
}
