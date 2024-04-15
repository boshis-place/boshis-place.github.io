module.exports = function (config) {
  /// format a date obj as a short date string
  function toShortDate(date, season)  {
    const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    if (season != null) {
      return `${season} ${utc.toLocaleDateString("en-US", { year: "numeric"})}`
    }

    return utc.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  config.addFilter("toShortDate", toShortDate)
}