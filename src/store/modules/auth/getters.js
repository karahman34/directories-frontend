export default {
  trashEnabled: state => {
    return state.user.setting.trash === 'enable'
  },
}
