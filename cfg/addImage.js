const Image = require("@11ty/eleventy-img")
const { join, extname } = require("path")
const { readdir } = require("fs/promises")

module.exports = function (config, srcDir, dstDir) {
  // -- constants --
  const imgDir = join(srcDir, "img")

  // build a map of img prefix to path, e.g. "img/example/image" => "img/example/image.png"
  const imgPathByPrefix = readdir(imgDir, {
    recursive: true,
  }).then((children) => {
    const map = new Map()

    for (const child of children) {
      const path = join(imgDir, child)

      const prefix = findImagePrefix(path)
      if (prefix != null) {
        map.set(prefix, path)
      }
    }

    return map
  })

  // find the extension-less prefix for a path
  function findImagePrefix(path) {
    const ext = extname(path)
    if (ext === "") {
      return null
    }

    return path.slice(0, -ext.length)
  }

  // find the image path for the src path. the src path may have no extension. if it
  // has an extension, the extension is ignored.
  async function findImagePath(src) {
    const prefix = findImagePrefix(src) ?? src
    const path = (await imgPathByPrefix).get(prefix)
    return path
  }

  // -- shortcodes --
  /// img shortcode for rendering optimized images
  async function image(srcOrImg, altOrMedia = null, media = "") {
    let src = srcOrImg
    if (typeof srcOrImg !== "string") {
      src = srcOrImg.src
      alt = srcOrImg.alt
      media = altOrMedia
    }

    if (src == null && alt == null) {
      return ""
    }

    const isRemoteUrl = Image.Util.isRemoteUrl(src)
    if (!isRemoteUrl) {
      src = join(imgDir, src)
      src = await findImagePath(src)
    }

    const meta = await Image(src, {
      widths: [200, 400, 600, 1200, "auto"],
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
  }

  config.addShortcode("img", image)
}
