export default {
  trashEnabled: state => {
    return state.user.settings.trash === 'enable'
  },
}
