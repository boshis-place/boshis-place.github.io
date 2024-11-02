export function UrlFiltersPlugin(config) {
  // add url filter for external link attrs
  config.addFilter("toExternalLinkAttrs", (url) => {
    if (url.startsWith("http")) {
      return `target="_blank" rel="noopener noreferrer"`
    }

    return undefined
  })

  // amend markdown parser to add external link attrs
  // see: https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
  config.amendLibrary("md", (mdLib) => {
    const rules = mdLib.renderer.rules

    // grab the default renderer
    let renderLink = rules.link_open
    renderLink ??= (tokens, idx, options, _env, self) => {
      return self.renderToken(tokens, idx, options)
    }

    // override the link renderer to add attributes to external links
    rules.link_open = function (tokens, idx, options, env, self) {
      const link = tokens[idx]

      const url = link.attrGet("href")
      if (url.startsWith("http")) {
        link.attrSet("target", "_blank")
        link.attrSet("rel", "noopener noreferrer")
      }

      return renderLink(tokens, idx, options, env, self)
    }
  })
}
