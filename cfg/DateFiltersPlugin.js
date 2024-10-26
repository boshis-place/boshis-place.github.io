module.exports = function (config) {
  const timeZone = "America/New_York"

  /// format a date obj as a short date string
  function toShortDate(date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone,
    })
  }

  config.addFilter("toShortDate", toShortDate)

  /// format a date obj as a full date string
  function toLongDate(date) {
    const dateString = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone,
    })

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone,
    })

    return `${dateString} @ ${timeString}`
  }

  config.addFilter("toLongDate", toLongDate)
}
