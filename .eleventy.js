const PostCSSPlugin = require("eleventy-plugin-postcss")

// -- config --
module.exports = function (config) {
  // -- constants --
  const srcDir = "src"
  const dstDir = "dist"

  // -- assets --
  config.addPlugin(PostCSSPlugin)
  config.addPassthroughCopy(`${srcDir}/img`)
  config.addPassthroughCopy(`${srcDir}/font`)
  config.addPassthroughCopy(`${srcDir}/**/*.js`)

  // -- collections --
  config.addCollection("upcomingEvents", (collections) => {
    return partitionedEvents(collections)[0]
  })

  config.addCollection("pastEvents", (collections) => {
    return partitionedEvents(collections)[1]
  })

  // -- c/helpers
  let _partitionedEvents = null

  function partitionedEvents(collections) {
    if (_partitionedEvents == null) {
      _partitionedEvents = partitionEvents(collections)
    }

    return _partitionedEvents
  }

  function partitionEvents(collections) {
    const events = collections.getFilteredByTag("events")

    const now = new Date()
    const upcomingEventIndex = events.findIndex((evt) => evt.date - now > 0)
    if (upcomingEventIndex < 0) {
      return [
        [],
        events.reverse(),
      ]
    }

    return [
      events.slice(upcomingEventIndex),
      events.slice(0, upcomingEventIndex).reverse(),
    ]
  }

  // -- filters --
  /// camelize a string
  function camelize(value, isLower) {
    return value
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
  }

  config.addFilter("camelize", (value) => camelize(value, false))
  config.addFilter("camelizeLower", (value) => camelize(value, true))

  // -- filters/date
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

  // -- filters/image
  /// resolve a relative or absolute image url
  function toImageUrl(path) {
    if (path.startsWith("http")) {
      return path
    } else {
      return `/img/${path}`
    }
  }

  config.addFilter("toImageUrl", toImageUrl)

  // -- filters/collections
  /// grab an element from a collection by name
  function named(collection, name) {
    return collection.find((el) => el.data.name === name)
  }

  config.addFilter("named", named)

  // -- filters/misc
  function rand(max) {
    return Math.floor(Math.random() * max)
  }

  config.addFilter("rand", rand)

  // -- output --
  return {
    dir: {
      input: srcDir,
      output: dstDir,
      layouts: "_layouts",
    },
  }
}
