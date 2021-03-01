function byteToKb(bytes) {
  return bytes / 1024
}

function byteToMb(bytes) {
  return byteToKb(bytes) / 1024
}

function byteToGb(bytes) {
  return byteToMb(bytes) / 1024
}

export { byteToKb, byteToMb, byteToGb }
