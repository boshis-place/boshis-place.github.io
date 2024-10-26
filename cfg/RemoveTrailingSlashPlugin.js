module.exports = function (config) {
  // not exactly web standard, but works fine
  // see: https://www.11ty.dev/docs/permalinks/#trailing-slashes

  // set global permalinks to resource.html style
  config.addGlobalData("permalink", () => {
    return (data) => {
      return `${data.page.filePathStem}.${data.page.outputFileExtension}`
    }
  })

  // remove .html from `page.url` entries
  config.addUrlTransform((page) => {
    if (page.url.endsWith(".html")) {
      return page.url.slice(0, -1 * ".html".length)
    }
  })
}
