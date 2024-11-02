import {
  CollectionsPlugin,
  DateFiltersPlugin,
  ExternalLinksPlugin,
  ImagePlugin,
  RandPlugin,
  RemoveTrailingSlashPlugin,
  SassPlugin,
  StringFiltersPlugin,
} from "./cfg/index.mjs"

// -- config --
export default function (config) {
  // -- constants --
  const srcDir = "./src"
  const dstDir = "./dist"

  // -- assets --
  config.addPassthroughCopy(`${srcDir}/img`)
  config.addPassthroughCopy(`${srcDir}/font`)
  config.addPassthroughCopy(`${srcDir}/**/*.js`)

  // -- modules --
  config.addPlugin(CollectionsPlugin)
  config.addPlugin(DateFiltersPlugin)
  config.addPlugin(ExternalLinksPlugin)
  config.addPlugin(ImagePlugin, { srcDir, dstDir })
  config.addPlugin(RandPlugin)
  config.addPlugin(RemoveTrailingSlashPlugin)
  config.addPlugin(SassPlugin)
  config.addPlugin(StringFiltersPlugin)

  // -- output --
  return {
    dir: {
      input: srcDir,
      output: dstDir,
      layouts: "_layouts",
    },
  }
}
