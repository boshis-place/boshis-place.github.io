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

  // -- filters/rand
  /// sample a random number up to a maximum (exclusive)
  function rand(max = 1) {
    return Math.random() * max
  }

  config.addFilter("rand", rand)

  /// sample a random integer up to a maximum (exclusive)
  function randInt(max) {
    return Math.floor(rand(max))
  }

  config.addFilter("randint", randInt)

  // -- shortcodes --
  /// sample a random number as a css variable
  function randVar() {
    return `--rand: ${rand()}`
  }

  config.addShortcode("randvar", randVar)

  // -- output --
  return {
    dir: {
      input: srcDir,
      output: dstDir,
      layouts: "_layouts",
    },
  }
}
