const {
  CollectionsPlugin,
  DateFiltersPlugin,
  UrlFiltersPlugin,
  ImagePlugin,
  RandPlugin,
  SassPlugin,
  StringFiltersPlugin,
  RemoveTrailingSlashPlugin,
} = require("./cfg")

// -- config --
module.exports = function (config) {
  // -- constants --
  const srcDir = "src"
  const dstDir = "dist"

  // -- assets --
  config.addPassthroughCopy(`${srcDir}/img`)
  config.addPassthroughCopy(`${srcDir}/font`)
  config.addPassthroughCopy(`${srcDir}/**/*.js`)

  // -- modules --
  config.addPlugin(CollectionsPlugin)
  config.addPlugin(DateFiltersPlugin)
  config.addPlugin(UrlFiltersPlugin)
  config.addPlugin(ImagePlugin, { srcDir, dstDir })
  config.addPlugin(RandPlugin)
  config.addPlugin(SassPlugin)
  config.addPlugin(StringFiltersPlugin)
  config.addPlugin(RemoveTrailingSlashPlugin)

  // -- output --
  return {
    dir: {
      input: srcDir,
      output: dstDir,
      layouts: "_layouts",
    },
  }
}
