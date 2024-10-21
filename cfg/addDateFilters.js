module.exports = function (config) {
  /// format a date obj as a short date string
  function toShortDate(date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  config.addFilter("toShortDate", toShortDate)

  function toLongDate(date) {
    const dateString = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })

    return `${dateString} @ ${timeString}`
  }
  config.addFilter("toLongDate", toLongDate)
}
