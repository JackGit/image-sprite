var inherit = require('./utils').inherit
var FORWARD = require('./constants').FORWARD
var BACKWARD = require('./constants').BACKWARD
var ALTERNATE = require('./constants').ALTERNATE

/* base PlayMode class */
function PlayMode (imageSprite) {
  this.imageSprite = imageSprite
  this.direction = FORWARD
}

PlayMode.prototype.updateDirection = function () {
  var imageSprite = this.imageSprite

  if (imageSprite.direction === ALTERNATE) {
    if (imageSprite.currentFrameIndex === 0 || imageSprite.currentFrameIndex === imageSprite.images.length - 1) {
      this.direction = this.direction === FORWARD ? BACKWARD : FORWARD
    }
  } else {
    this.direction = imageSprite.direction
  }
}

PlayMode.prototype.update = function () {
  var imageSprite = this.imageSprite

  if (this.direction === FORWARD) {
    imageSprite.next()
  } else {
    imageSprite.prev()
  }

  this.updateDirection()
}

/* LoopMode class */
function LoopMode () {
  PlayMode.apply(this, arguments)
}

LoopMode.prototype = inherit(PlayMode.prototype, {
  constructor: LoopMode,

  done: function () {
    return false
  }
})

/* RepeatMode class */
function RepeatMode (imageSprite, repeat) {
  PlayMode.apply(this, arguments)
  this.repeat = repeat
  this.count = 0
  this.startFrameIndex = imageSprite.currentFrameIndex
}

RepeatMode.prototype = inherit(PlayMode.prototype, {
  constructor: RepeatMode,

  done: function () {
    return this.count === this.repeat
  },

  update: function () {
    PlayMode.prototype.update.apply(this)
    if (this.imageSprite.currentFrameIndex === this.startFrameIndex) {
      ++this.count
    }
  }
})

/* ByFrameMode class */
function ByFrameMode (imageSprite, totalFrames) {
  PlayMode.apply(this, arguments)
  this.count = 0
  this.total = totalFrames
}

ByFrameMode.prototype = inherit(PlayMode.prototype, {
  constructor: ByFrameMode,

  done: function () {
    return this.count === this.total
  },

  update: function () {
    PlayMode.prototype.update.apply(this)
    ++this.count
  }
})

/* ToFrameMode class */
function ToFrameMode (imageSprite, targetFrameIndex) {
  PlayMode.apply(this, arguments)
  this.targetFrameIndex = targetFrameIndex
}

ToFrameMode.prototype = inherit(PlayMode.prototype, {
  constructor: ToFrameMode,

  done: function () {
    return this.imageSprite.currentFrameIndex === this.targetFrameIndex
  }
})

module.exports = {
  LoopMode: LoopMode,
  RepeatMode: RepeatMode,
  ToFrameMode: ToFrameMode,
  ByFrameMode: ByFrameMode
}
