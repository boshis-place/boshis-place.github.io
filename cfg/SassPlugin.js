const path = require("node:path")
const autoprefixer = require("autoprefixer")
const postcss = require("postcss")
const sass = require("sass")

module.exports = function (config) {
  const autoprefix = postcss([autoprefixer])

  config.addTemplateFormats("scss")
  config.addExtension("scss", {
    outputFileExtension: "css",
    async compile(input, inputPath) {
      const inputDir = path.parse(inputPath).dir

      let css = ""

      // compile sass file relative to its dir
      const sassResult = sass.compileString(input, {
        loadPaths: [inputDir ?? "."],
        style: process.env.PROD ? "compressed" : undefined,
      })

      // link this scss file to any included files for recompilation
      this.addDependencies(inputPath, sassResult.loadedUrls)

      css = sassResult.css

      // apply autoprefixer
      const autoprefixResult = await autoprefix.process(css, {
        from: inputPath,
      })

      for (const warning in autoprefixResult.warnings()) {
        console.warn(warning)
      }

      css = autoprefixResult.css

      // resolve eleventy data
      return async (_data) => {
        return css
      }
    },
  })
}
