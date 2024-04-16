const PostCSSPlugin = require("eleventy-plugin-postcss")
const addCollections = require("./cfg/addCollections")
const addDateFilters = require("./cfg/addDateFilters")
const addImage = require("./cfg/addImage")
const addRand = require("./cfg/addRand")
const addStringFilters = require("./cfg/addStringFilters")

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

  // -- modules --
  addCollections(config)
  addDateFilters(config)
  addImage(config, srcDir, dstDir)
  addRand(config)
  addStringFilters(config)

  // -- output --
  return {
    dir: {
      input: srcDir,
      output: dstDir,
      layouts: "_layouts",
    },
  }
}
