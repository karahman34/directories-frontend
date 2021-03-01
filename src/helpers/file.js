function isImage(file) {
  const pattern = /^image\/.+$/

  return pattern.test(file.mime_type)
}

function fullFileName(file) {
  return `${file.name}.${file.extension}`
}

function getIconFile(file) {
  const mime_type = file.mime_type
  const zipFile = /^application\/(vnd.rar|zip|x-7z-compressed|x-bzip|x-bzip-2|gzip)$/
  const audioFile = /^audio\/.+$/
  const videoFile = /^video\/.+$/
  const textFile = /^text\/.+$/

  if (zipFile.test(mime_type)) {
    return 'mdi-folder-zip'
  } else if (audioFile.test(mime_type)) {
    return 'mdi-file-music'
  } else if (videoFile.test(mime_type)) {
    return 'mdi-video'
  } else if (textFile.test(mime_type)) {
    return 'mdi-text-box'
  } else {
    return 'mdi-file'
  }
}

export { isImage, fullFileName, getIconFile }
