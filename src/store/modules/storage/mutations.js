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
  ADD_RECENT_UPLOAD(state, file) {
    state.recentUploads.push(file)
  },
}