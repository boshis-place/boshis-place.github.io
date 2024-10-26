import Image from "@11ty/eleventy-img"

export function ImagePlugin(config, { srcDir, dstDir }) {
  // -- shortcodes --
  /// img shortcode for rendering optimized images
  async function image(srcOrImg, altOrMedia = null, media = "") {
    let src = srcOrImg
    let alt = null

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
      src = `${srcDir}/img/${src}`
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
