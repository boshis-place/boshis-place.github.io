module.exports = function (config) {
  // -- filters --
  /// sample a random number up to a maximum (exclusive)
  function rand(max = 1) {
    return Math.random() * max
  }

  config.addFilter("rand", rand)

  /// sample a random integer up to a maximum (exclusive)
  function randInt(max) {
    return Math.floor(rand(max))
  }

  config.addFilter("randint", randInt)

  // -- shortcodes --
  /// sample a random number as a css variable
  function randVar() {
    return `--rand: ${rand()}`
  }

  config.addShortcode("randvar", randVar)
}