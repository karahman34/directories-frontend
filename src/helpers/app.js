function setWindowTitle(title) {
  const appTitle = process.env.VUE_APP_TITLE

  document.title = !title ? appTitle : `${title} - ${appTitle}`
}

export { setWindowTitle }
