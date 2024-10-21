const Image = require("@11ty/eleventy-img")

module.exports = function (config, srcDir, dstDir) {
  // -- shortcodes --
  /// add img shortcode for rendering optimized images
  config.addShortcode(
    "img",
    async function (srcOrImg, altOrMedia = null, media = "") {
      let src = srcOrImg
      if (typeof srcOrImg !== "string") {
        src = srcOrImg.src
        alt = srcOrImg.alt
        media = altOrMedia
      }

      const isRemoteUrl = Image.Util.isRemoteUrl(src)
      if (!isRemoteUrl) {
        src = `${srcDir}/img/${src}`
      }

      const meta = await Image(src, {
        widths: [200, "auto"],
        formats: isRemoteUrl ? ["jpeg"] : ["auto"],
        urlPath: "/img",
        outputDir: `./${dstDir}/img/`,
      })

      const html = Image.generateHTML(meta, {
        alt,
        sizes: media,
        loading: "lazy",
        decoding: "async",
      })

      return html
    },
  )
}
