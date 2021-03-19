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
    if (Array.isArray(state.recentUploads)) {
      state.recentUploads.unshift(file)
    }
  },
  CHANGE_RECENT_UPLOAD_VISIBILITY(state, file) {
    const target = state.recentUploads.find(x => x.id === file.id)
    target.is_public = file.is_public
  },
  REMOVE_RECENT_UPLOAD(state, file) {
    if (Array.isArray(state.recentUploads)) {
      const targetIndex = state.recentUploads.findIndex(
        _file => _file.id === file.id,
      )

      if (targetIndex >= 0) {
        state.recentUploads.splice(targetIndex, 1)
      }
    }
  },
  INCREASE_USED_SPACE(state, size) {
    state.usedSpace += size
  },
  DECREASE_USED_SPACE(state, size) {
    state.usedSpace -= size
  },
  SET_ROOT(state, root) {
    state.root = root
  },
  SET_SEARCH(state, search) {
    state.search = search
  },
}
