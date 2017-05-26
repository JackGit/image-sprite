var DOMRenderer = require('./dom-renderer')
var CanvasRenderer = require('./canvas-renderer')
var loadImages = require('./utils').loadImages
var getValidIndex = require('./utils').getValidIndex
var LoopMode = require('./play-modes').LoopMode
let RepeatMode = require('./play-modes').RepeatMode
let ByFrameMode = require('./play-modes').ByFrameMode
let ToFrameMode = require('./play-modes').ToFrameMode
var FORWARD = require('./constants').FORWARD
var BACKWARD = require('./constants').BACKWARD
var ALTERNATE = require('./constants').ALTERNATE

function ImageSprite (el, options) {
  var defaultOptions = {
    width: 200,
    height: 200,
    mode: 'canvas', // dom
    interval: 16,
    images: [], // array of image url / element, or a sprite image
    onLoaded:  function () { console.log('on loaded') },
    onUpdate: function () { console.log('on update') },
    onComplete:  function () { console.log('on complete') }
  }

  options = (options || {})
  this.options = {}
  for (var p in defaultOptions) {
    if (options[p]) {
      this.options[p] = options[p]
    } else {
      this.options[p] = defaultOptions[p]
    }
  }

  this.el = typeof el === 'string' ? document.getElementById(el) : el
  this.renderer = this.options.mode === 'canvas'
    ? new CanvasRenderer(this.options.width, this.options.height)
    : new DOMRenderer(this.options.width, this.options.height)
  this.images = []

  this.isPlaying = false
  this.playMode = null
  this.direction = FORWARD
  this.interval = 1000 / 16
  this.currentFrameIndex = -1
  this.lastTick = 0
  this.seedId = 0

  this._init()
}

ImageSprite.prototype._init = function () {
  this.el.style.width = this.options.width + 'px'
  this.el.style.height = this.options.height + 'px'
  this.el.innerHTML = ''
  this.el.appendChild(this.renderer.domElement)
  this._load()
}

ImageSprite.prototype._load = function () {
  if (this.options.images.filter(function (image) { return typeof image === 'string' }).length === 0) {
    this._onLoad(this.options.images)
  } else {
    loadImages(this.options.images, function (results) {
      this._onLoad(results)
    }.bind(this))
  }
}

ImageSprite.prototype._onLoad = function (results) {
  this.images = results
  this.options.onLoaded && this.options.onLoaded.bind(this)()
  this.next()
  this._loop()
}

ImageSprite.prototype._loop = function () {
  if (Date.now() - this.lastTick > this.interval) {
    if (this.isPlaying && !this.playMode.done()) {
      this.playMode.update()
      this.options.onUpdate && this.options.onUpdate.bind(this)()
    } else if (this.isPlaying && this.playMode.done()){
      this.isPlaying = false
      this.options.onComplete && this.options.onComplete.bind(this)()
    }
    this.lastTick = Date.now()
  }

  this.seedId = requestAnimationFrame(this._loop.bind(this))
}

ImageSprite.prototype._draw = function () {
  var image = this.images[this.currentFrameIndex]
  image && this.renderer.drawImage(image)
}

ImageSprite.prototype.play = function (opts) {
  opts = (opts || {})

  if (opts.loop === true) {
    this.playMode = new LoopMode(this)
  } else if (opts.repeat > 0) {
    this.playMode = new RepeatMode(this, opts.repeat)
  } else if (opts.byFrame > 0) {
    this.playMode = new ByFrameMode(this, opts.byFrame)
  } else if (opts.toFrame !== null && opts.toFrame !== undefined) {
    this.playMode = new ToFrameMode(this, getValidIndex(opts.toFrame, this.images.length))
  } else {
    this.playMode = new LoopMode(this)
  }

  this.direction = opts.direction || FORWARD
  this.interval = opts.interval || this.options.interval
  this.isPlaying = true
  this.lastTick = 0
}

ImageSprite.prototype.pause = function () {
  this.isPlaying = false
}

ImageSprite.prototype.next =function () {
  this.currentFrameIndex = getValidIndex(this.currentFrameIndex + 1, this.images.length)
  this._draw()
}

ImageSprite.prototype.prev = function () {
  this.currentFrameIndex = getValidIndex(this.currentFrameIndex - 1, this.images.length)
  this._draw()
}

ImageSprite.prototype.jump = function (index) {
  this.currentFrameIndex = getValidIndex(index, this.images.length)
  this._draw()
}

ImageSprite.prototype.destroy = function () {
  cancelAnimationFrame(this.seedId)
  this.isPlaying = false
  this.images = null
  this.playMode = null
}

module.exports = ImageSprite
