function showValidationErrors(errors, fields) {
  const errorsFields = Object.keys(errors)

  for (const key in fields) {
    fields[key] = errorsFields.includes(key) ? errors[key][0] : null
  }
}

function hideValidationErrors(fields) {
  for (const key in fields) {
    fields[key] = null
  }
}

export { showValidationErrors, hideValidationErrors }
