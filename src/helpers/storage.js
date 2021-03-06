function byteToKb(bytes) {
  return Number(bytes / 1024)
}

function byteToMb(bytes) {
  return Number(byteToKb(bytes) / 1024)
}

function byteToGb(bytes) {
  return Number(byteToMb(bytes) / 1024)
}

function formatStorageSpace(size) {
  size = size.toString()
  const dotIndex = size.indexOf('.')

  if (dotIndex === -1) {
    return size
  }

  return size.slice(0, dotIndex + 3)
}

function setSubFoldersObject(subFolders) {
  subFolders.forEach(el => {
    el.directories = null

    delete el.files
    delete el.sub_folders
  })
}

function setDirectoryObject(directory) {
  setSubFoldersObject(directory.sub_folders)

  directory.directories = [...directory.sub_folders, ...directory.files]

  delete directory.files
  delete directory.sub_folders
}

export {
  byteToKb,
  byteToMb,
  byteToGb,
  formatStorageSpace,
  setDirectoryObject,
  setSubFoldersObject,
}
