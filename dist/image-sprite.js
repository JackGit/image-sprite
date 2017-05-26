(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ImageSprite"] = factory();
	else
		root["ImageSprite"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
  FORWARD: 'forward',
  BACKWARD: 'backward',
  ALTERNATE: 'alternate'
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var inherit = __webpack_require__(2).inherit
var FORWARD = __webpack_require__(0).FORWARD
var BACKWARD = __webpack_require__(0).BACKWARD
var ALTERNATE = __webpack_require__(0).ALTERNATE

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
  this.updateDirection()

  if (this.direction === FORWARD) {
    imageSprite.next()
  } else {
    imageSprite.prev()
  }
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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

function loadImage (imageURL, onLoaded) {
  var image = new Image()
  image.onload = function () { onLoaded(image) }
  image.crossOrigin = true
  image.src = imageURL
}

function loadImages (images, onLoaded) {
  var results = new Array(images.length)

  images.forEach(function (image, index) {
    if (typeof image === 'string') {
      loadImage(image, function (imageLoaded) {
        results[index] = imageLoaded
        if (results.filter(function (r) { return r }).length === images.length) {
          onLoaded && onLoaded(results)
        }
      })
    } else {
      results[index] = image
    }
  })
}

function getValidIndex (index, length) {
  if (length < 1) {
    return -1
  }

  if (index >= 0) {
    index %= length
  } else {
    index = (length + index % length) % length
  }
  return index
}

function inherit (prototype, body) {
  return Object.assign(Object.create(prototype), body)
}

module.exports = {
  loadImages: loadImages,
  getValidIndex: getValidIndex,
  inherit: inherit
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/* export default class Renderer {
  constructor (width, height) {
    this.domElement = null
    this.width = width
    this.height = height
  }

  _init () {}

  drawImage (image) {}
}*/

function Renderer (width, height) {
  this.width = width
  this.height = height
  this.domElement = null
}

Renderer.prototype._init = function () {}
Renderer.prototype.drawImage = function () {}

module.exports = Renderer


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* import Renderer from './renderer.js'

export default class CanvasRenderer extends Renderer {
  constructor (width, height) {
    super(width, height)
    this.context = null
    this._init()
  }

  _init () {
    let canvas = document.createElement('canvas')
    canvas.width = canvas.style.width = this.width
    canvas.height = canvas.style.height = this.height
    this.context = canvas.getContext('2d')
    this.domElement = canvas
  }

  drawImage (image) {
    console.log('draw image', image, image.complete)
    this.context.drawImage(image, 0, 0, this.width, this.height)
  }
}
*/

var Renderer = __webpack_require__(3)
var inherit = __webpack_require__(2).inherit

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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*import Renderer from './renderer.js'

export default class DOMRenderer extends Renderer {
  constructor (width, height) {
    super(width, height)
    this.images = []
    this._init()
  }

  _init () {
    let div = document.createElement('div')
    div.style.display = 'inline-block'
    div.style.position = 'absolute'
    div.style.margin = 0
    div.style.padding = 0
    this.domElement = div
  }

  _styleImage (image) {
    image.style.position = 'absolute'
    image.style.top = 0
    image.style.left = 0
    image.style.width = this.width + 'px'
    image.style.height = this.height + 'px'
  }

  drawImage (image) {
    if (this.images.indexOf(image) === -1) {
      this._styleImage(image)
      this.domElement.appendChild(image)
      this.images.push(image)
    } else {
      this.images.forEach(img => {
        if (img === image) {
          img.style.display = 'block'
        } else {
          img.style.display = 'none'
        }
      })
    }
  }
}*/
var Renderer = __webpack_require__(3)
var inherit = __webpack_require__(2).inherit

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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var DOMRenderer = __webpack_require__(5)
var CanvasRenderer = __webpack_require__(4)
var loadImages = __webpack_require__(2).loadImages
var getValidIndex = __webpack_require__(2).getValidIndex
var LoopMode = __webpack_require__(1).LoopMode
let RepeatMode = __webpack_require__(1).RepeatMode
let ByFrameMode = __webpack_require__(1).ByFrameMode
let ToFrameMode = __webpack_require__(1).ToFrameMode
var FORWARD = __webpack_require__(0).FORWARD
var BACKWARD = __webpack_require__(0).BACKWARD
var ALTERNATE = __webpack_require__(0).ALTERNATE

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


/***/ })
/******/ ]);
});