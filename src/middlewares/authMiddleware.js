export default function({ store, next }) {
  if (!store.state.auth.loggedIn) {
    next({
      name: 'Login',
    })
  }

  return null
}
