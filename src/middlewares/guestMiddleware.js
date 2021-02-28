export default function({ store, next }) {
  if (store.state.auth.loggedIn) {
    next({
      name: 'Dashboard',
    })
  }

  return null
}
