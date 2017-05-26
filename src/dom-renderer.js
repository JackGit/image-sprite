var Renderer = require('./renderer')
var inherit = require('./utils').inherit

function DomRenderer (width, height) {
  Renderer.apply(this, arguments)
  this.images = []
  this._init()
}

DomRenderer.protoype = inherit(Renderer.prototype, {
  constructor: DomRenderer,

  _init: function () {
    var div = document.createElement('div')
    div.style.display = 'inline-block'
    div.style.position = 'absolute'
    div.style.margin = 0
    div.style.padding = 0
    this.domElement = div
  },

  _styleImage: function () {
    image.style.position = 'absolute'
    image.style.top = 0
    image.style.left = 0
    image.style.width = this.width + 'px'
    image.style.height = this.height + 'px'
  },

  drawImage: function (image) {
    if (this.images.indexOf(image) === -1) {
      this._styleImage(image)
      this.domElement.appendChild(image)
      this.images.push(image)
    } else {
      this.images.forEach(function (img) {
        if (img === image) {
          img.style.display = 'block'
        } else {
          img.style.display = 'none'
        }
      })
    }
  }
})

module.exports = DomRenderer
