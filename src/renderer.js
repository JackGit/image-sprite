function Renderer (width, height) {
  this.width = width
  this.height = height
  this.domElement = null
}

Renderer.prototype._init = function () {}
Renderer.prototype.drawImage = function () {}

module.exports = Renderer
