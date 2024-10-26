import path from "node:path"
import autoprefixer from "autoprefixer"
import postcss from "postcss"
import * as sass from "sass"

export function SassPlugin(config) {
  const autoprefix = postcss([autoprefixer])

  // register the template format
  config.addTemplateFormats("scss")

  // add an extension to process templates with the above format
  config.addExtension("scss", {
    outputFileExtension: "css",
    // override the "permalink" data function defined by `RemoveTrailingSlashPlugin` to
    // output the expeceted css file path instead.
    //
    // see: https://github.com/11ty/eleventy/issues/3472#issuecomment-2439677975
    async getData(inputPath) {
      const permalink = path.parse(inputPath)

      return {
        permalink: path.format({
          ...permalink,
          dir: "",
          base: permalink.base.replace("scss", this.outputFileExtension),
        }),
      }
    },
    // compile the scss input string at the specified path into a css file
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
