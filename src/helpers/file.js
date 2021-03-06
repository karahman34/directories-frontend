import { tokenName } from '@/plugins/http'

function isImage(file) {
  const pattern = /^image\/.+$/

  return isFile(file) && pattern.test(file.mime_type)
}

function isVideo(file) {
  const pattern = /^video\/.+$/

  return isFile(file) && pattern.test(file.mime_type)
}

function fileAuthSrc(src) {
  let token = localStorage.getItem(tokenName)

  if (!token) {
    throw new Error('token not found.')
  }

  token = token.split(' ')[1]

  return `${src}?token=${token}`
}

function isFile(file) {
  return (
    Object.prototype.hasOwnProperty.call(file, 'path') &&
    Object.prototype.hasOwnProperty.call(file, 'extension') &&
    Object.prototype.hasOwnProperty.call(file, 'mime_type')
  )
}

function formatFileSize(size) {
  size = size.toString()
  const dot = size.indexOf('.')

  if (dot === -1) {
    return size
  }

  return size.slice(0, dot + 2)
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

export {
  isImage,
  isVideo,
  fullFileName,
  getIconFile,
  isFile,
  formatFileSize,
  fileAuthSrc,
}
