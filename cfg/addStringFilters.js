module.exports = function (config) {
  /// camelize a string
  function camelize(value, isLower) {
    if (value == null) {
      return
    }

    const camelized = value
      .split(/\s+/)
      .map((s, i) => {
        let first = s.slice(0, 1)
        if (i === 0 && isLower) {
          first = first.toLowerCase()
        } else {
          first = first.toUpperCase()
        }

        return first + s.slice(1, s.length)
      })
      .join("")

    return camelized
  }

  config.addFilter("camelize", (value) => {
    return camelize(value, false)
  })

  config.addFilter("camelizeLower", (value) => {
    return camelize(value, true)
  })

  /// convert a string to an id (dash-cased)
  config.addFilter("id", (value) => {
    if (value == null) {
      return ""
    }

    return value.toLowerCase().replaceAll(" ", "-")
  })
}
