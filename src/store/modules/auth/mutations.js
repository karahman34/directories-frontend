export default {
  SET_USER(state, user) {
    state.user = user
  },
  SET_LOGGED_IN(state, val) {
    state.loggedIn = val
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
}
