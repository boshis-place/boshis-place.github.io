module.exports = function (config) {
  // -- remove trailing slash --
  // not exactly web standard, but works fine
  // https://www.11ty.dev/docs/permalinks/#trailing-slashes
  // Set global permalinks to resource.html style
  config.addGlobalData("permalink", () => {
    return (data) =>
      `${data.page.filePathStem}.${data.page.outputFileExtension}`
  })
  // Remove .html from `page.url` entries
  config.addUrlTransform((page) => {
    if (page.url.endsWith(".html")) {
      return page.url.slice(0, -1 * ".html".length)
    }
  })
}
