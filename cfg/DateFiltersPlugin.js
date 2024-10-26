module.exports = function (config) {
  /// format a date obj as a short date string
  function toShortDate(date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    })
  }

  config.addFilter("toShortDate", toShortDate)

  function toLongDate(date) {
    const dateString = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    })

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
      timeZoneName: "short",
    })

    return `${dateString} @ ${timeString}`
  }

  config.addFilter("toLongDate", toLongDate)
}
