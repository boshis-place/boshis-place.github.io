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
      _partitionedEvents = partitionEvents(collections)
    }

    return _partitionedEvents
  }

  function partitionEvents(collections) {
    const events = collections.getFilteredByTag("events")

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
