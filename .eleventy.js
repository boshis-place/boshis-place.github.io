const addCollections = require("./cfg/addCollections")
const addDateFilters = require("./cfg/addDateFilters")
const addExternalLinkAttrs = require("./cfg/addExternalLinkAttrs")
const addImage = require("./cfg/addImage")
const addRand = require("./cfg/addRand")
const addSass = require("./cfg/addSass")
const addStringFilters = require("./cfg/addStringFilters")
const addRemoveTrailingSlash = require("./cfg/addRemoveTrailingSlash")

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
  addCollections(config)
  addDateFilters(config)
  addExternalLinkAttrs(config)
  addImage(config, srcDir, dstDir)
  addRand(config)
  addSass(config)
  addStringFilters(config)
  addRemoveTrailingSlash(config)

  // -- output --
  return {
    dir: {
      input: srcDir,
      output: dstDir,
      layouts: "_layouts",
    },
  }
}
