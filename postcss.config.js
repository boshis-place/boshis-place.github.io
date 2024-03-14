const config = {
  plugins: [
    require("postcss-nested-ancestors"),
    require("postcss-mixins"),
    require("postcss-import"),
    require("postcss-simple-vars"),
    require("postcss-calc"),
    require("postcss-nested"),
    require("autoprefixer"),
  ],
}

module.exports = config
