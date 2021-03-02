function byteToKb(bytes) {
  return Number(bytes / 1024)
}

function byteToMb(bytes) {
  return Number(byteToKb(bytes) / 1024)
}

function byteToGb(bytes) {
  return Number(byteToMb(bytes) / 1024)
}

function setDirectoryObject(directory) {
  directory.sub_folders.forEach(el => {
    el.directories = null

    delete el.files
    delete el.sub_folders
  })

  directory.directories = [...directory.sub_folders, ...directory.files]

  delete directory.files
  delete directory.sub_folders
}

export { byteToKb, byteToMb, byteToGb, setDirectoryObject }
