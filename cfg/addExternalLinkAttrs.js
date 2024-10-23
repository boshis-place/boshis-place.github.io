module.exports = function (config) {
  config.addFilter("toExternalLinkAttrs", (url) => {
    if (url.startsWith("http")) {
      return `target="_blank" rel="noopener noreferrer"`
    }
  })
}
