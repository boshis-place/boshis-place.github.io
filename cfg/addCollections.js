module.exports = function (config) {
  config.addCollection("upcomingEvents", (collections) => {
    return partitionedEvents(collections)[0]
  })

  config.addCollection("pastEvents", (collections) => {
    return partitionedEvents(collections)[1]
  })

  // -- helpers --
  let _partitionedEvents = null

  function partitionedEvents(collections) {
    if (_partitionedEvents == null) {
      const events = collections.getFilteredByTag("events")
      processEvents(events)
      _partitionedEvents = partitionEvents(events)
    }

    return _partitionedEvents
  }

  function processEvents(events) {
    for (const event of events) {
      const poster = event.data.poster
      if (poster.src == null) {
        const index = 1 + Math.floor(Math.random() * 5)
        poster.src = `/placeholders/placeholder${index}.jpg`
      }
    }
  }

  function partitionEvents(events) {
    const now = new Date()
    const upcomingEventIndex = events.findIndex((evt) => evt.date - now > 0)
    if (upcomingEventIndex < 0) {
      return [[], events.reverse()]
    }

    return [
      events.slice(upcomingEventIndex),
      events.slice(0, upcomingEventIndex).reverse(),
    ]
  }
}
