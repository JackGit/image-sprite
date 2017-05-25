import DOMRenderer from './dom-renderer.js'
import CanvasRenderer from './canvas-renderer.js'
import { loadImages, getValidIndex } from './utils.js'

const FORWARD = 'forward'
const BACKWARD = 'backward'
const ALTERNATE = 'alternate'

export default class ImageSprite {

  constructor (el, options) {
    let defaultOptions = {
      width: 300,
      height: 400,
      mode: 'canvas', // dom
      interval: 16,
      images: [], // array of image url / element, or a sprite image
      onLoaded:  function () { console.log('on loaded') },
      onUpdate: function () { console.log('on update') },
      onComplete:  function () { console.log('on complete') }
    }

    this.el = typeof el === 'string' ? document.getElementById(el) : el
    this.options = defaultOptions
    this.renderer = this.options.mode === 'canvas' ? new CanvasRenderer() : new DOMRenderer()
    this.images = []

    this.isPlaying = false
    this.playMode = null
    this.direction = FORWARD
    this.interval = 1000 / 16
    this.currentFrameIndex = 0
    this.lastTick = 0
    this.seedId = 0

    this._init()
  }

  _init () {
    this._load()
  }

  _load () {
    if (this.options.images.filter(image => typeof image === 'string').length === 0) {
      this._onLoad(this.options.images)
    } else {
      loadImages(this.options.images, results => {
        this._onLoad(results)
      })
    }
  }

  _onLoad (results) {
    this.images = results
    this.options.onLoaded && this.options.onLoaded.bind(this)()
    this._draw()
    this._loop()
  }

  _loop () {
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

  _draw () {
    let image = this.images[this.currentFrameIndex]
    this.renderer.drawImage(image)
  }

  play (opts = {}) {
    let options = {
      interval: opts.interval || this.options.interval,
      loop: (opts.loop === null || opts.loop === undefined) ? true : opts.loop,
      repeat: opts.repeat || 0,
      direction: opts.direction || FORWARD,
      toFrame: opts.toFrame || null,
      byFrame: opts.byFrame || null
    }

    if (options.loop === true) {
      this.playMode = new LoopMode(this)
    } else if (options.repeat > 0) {
      this.playMode = new RepeatMode(this, options.repeat)
    } else if (options.byFrame > 0) {
      this.playMode = new ByFrameMode(this, options.byFrame)
    } else if (options.toFrame !== null && options.toFrame !== undefined) {
      this.playMode = new ToFrameMode(this, options.toFrame)
    }

    this.direction = options.direction
    this.interval = options.interval
    this.isPlaying = true
    this.lastTick = 0
  }

  pause () {
    this.isPlaying = false
  }

  next () {
    this.currentFrameIndex = getValidIndex(this.currentFrameIndex + 1, this.images.length)
    this._draw()
  }

  prev () {
    this.currentFrameIndex = getValidIndex(this.currentFrameIndex - 1, this.images.length)
    this._draw()
  }

  jump (index) {
    this.currentFrameIndex = getValidIndex(index, this.images.length)
    this._draw()
  }

  destroy () {
    cancelAnimationFrame(this.seedId)
    this.isPlaying = false
    this.images = null
    this.playMode = null
  }
}

class PlayMode {

  constructor (imageSprite) {
    this.imageSprite = imageSprite
    this.direction = FORWARD
  }

  updateDirection () {
    let imageSprite = this.imageSprite

    if (imageSprite.direction === ALTERNATE) {
      if (imageSprite.currentFrameIndex === 0 || imageSprite.currentFrameIndex === imageSprite.images.length - 1) {
        this.direction = this.direction === FORWARD ? BACKWARD : FORWARD
      }
    } else {
      this.direction = imageSprite.direction
    }
  }

  update () {
    let imageSprite = this.imageSprite
    this.updateDirection()

    if (this.direction === FORWARD) {
      imageSprite.next()
    } else {
      imageSprite.prev()
    }
  }
}

class LoopMode extends PlayMode {

  constructor (imageSprite) {
    super(imageSprite)
  }

  done () {
    return false
  }
}

class RepeatMode extends PlayMode {

  constructor (imageSprite, repeat) {
    super(imageSprite)
    this.repeat = repeat
    this.count = 0
    this.startFrameIndex = imageSprite.currentFrameIndex
  }

  done () {
    return this.count === this.repeat
  }

  update () {
    super.update()
    if (this.imageSprite.currentFrameIndex === this.startFrameIndex) {
      ++this.count
    }
  }
}

class ByFrameMode extends PlayMode {

  constructor (imageSprite, totalFrames) {
    super(imageSprite)
    this.count = 0
    this.total = totalFrames
  }

  done () {
    return this.count === this.total
  }

  update () {
    super.update()
    ++this.count
  }
}

class ToFrameMode extends PlayMode {

  constructor (imageSprite, targetFrameIndex) {
    super(imageSprite)
    this.targetFrameIndex = targetFrameIndex
  }

  done () {
    return this.imageSprite.currentFrameIndex === this.targetFrameIndex
  }
}
