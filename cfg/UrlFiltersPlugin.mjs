export function UrlFiltersPlugin(config) {
  config.addFilter("toExternalLinkAttrs", (url) => {
    if (url.startsWith("http")) {
      return `target="_blank" rel="noopener noreferrer"`
    }

    return undefined
  })
}
