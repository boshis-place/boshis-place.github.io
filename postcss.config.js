const config = {
  plugins: [
    require("postcss-nested-ancestors"),
    require("postcss-mixins"),
    require("postcss-import"),
    require("postcss-calc"),
    require("postcss-nested"),
    require("postcss-simple-vars"),
    require("autoprefixer"),
  ],
}

module.exports = config
