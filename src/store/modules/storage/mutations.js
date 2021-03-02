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
    state.usedSpace += file.size

    if (Array.isArray(state.recentUploads)) {
      state.recentUploads.unshift(file)
    }
  },
  ADD_RECENT_UPLOAD(state, file) {
    state.recentUploads.push(file)
  },
  REMOVE_RECENT_UPLOAD(state, file) {
    state.usedSpace -= file.size

    if (Array.isArray(state.recentUploads)) {
      const targetIndex = state.recentUploads.findIndex(
        _file => _file.id === file.id,
      )

      if (targetIndex >= 0) {
        state.recentUploads.splice(targetIndex, 1)
      }
    }
  },
  SET_ROOT(state, root) {
    state.root = root
  },
  SET_SEARCH(state, search) {
    state.search = search
  },
}
