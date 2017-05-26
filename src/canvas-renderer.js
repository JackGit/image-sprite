var Renderer = require('./renderer')
var inherit = require('./utils').inherit

function CanvasRenderer (width, height) {
  Renderer.apply(this, arguments)
  this.context = null
  this._init()
}

CanvasRenderer.prototype = inherit(Renderer.prototype, {
  constructor: CanvasRenderer,

  _init: function () {
    var canvas = document.createElement('canvas')
    canvas.width = canvas.style.width = this.width
    canvas.height = canvas.style.height = this.height
    this.context = canvas.getContext('2d')
    this.domElement = canvas
  },

  drawImage: function (image) {
    console.log('draw image', image, image.complete)
    this.context.drawImage(image, 0, 0, this.width, this.height)
  }
})

module.exports = CanvasRenderer
