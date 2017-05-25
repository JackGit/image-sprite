/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Renderer {
  constructor () {

  }

  drawImage (image) {
    console.log('draw image', image)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Renderer;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom_renderer_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__canvas_renderer_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_js__ = __webpack_require__(5);




const FORWARD = 'forward'
const BACKWARD = 'backward'
const ALTERNATE = 'alternate'

class ImageSprite {

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
    this.renderer = this.options.mode === 'canvas' ? new __WEBPACK_IMPORTED_MODULE_1__canvas_renderer_js__["a" /* default */]() : new __WEBPACK_IMPORTED_MODULE_0__dom_renderer_js__["a" /* default */]()
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
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_js__["a" /* loadImages */])(this.options.images, results => {
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
    this.currentFrameIndex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_js__["b" /* getValidIndex */])(this.currentFrameIndex + 1, this.images.length)
    this._draw()
  }

  prev () {
    this.currentFrameIndex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_js__["b" /* getValidIndex */])(this.currentFrameIndex - 1, this.images.length)
    this._draw()
  }

  jump (index) {
    this.currentFrameIndex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_js__["b" /* getValidIndex */])(index, this.images.length)
    this._draw()
  }

  destroy () {
    cancelAnimationFrame(this.seedId)
    this.isPlaying = false
    this.images = null
    this.playMode = null
  }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = ImageSprite;


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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var ImageSprite = __webpack_require__(1)

window.ImageSprite = ImageSprite


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderer_js__ = __webpack_require__(0);


class CanvasRenderer extends __WEBPACK_IMPORTED_MODULE_0__renderer_js__["a" /* default */] {
  constructor () {
    super()
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CanvasRenderer;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderer_js__ = __webpack_require__(0);


class DOMRenderer extends __WEBPACK_IMPORTED_MODULE_0__renderer_js__["a" /* default */] {
  constructor () {
    super()
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DOMRenderer;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = loadImages;
/* harmony export (immutable) */ __webpack_exports__["b"] = getValidIndex;
function loadImages (imageURLs, onLoaded) {
  let results = new Array(imageURLs.length)

  imageURLs.forEach((url, index) => {
    loadImage(url, image => {
      if (typeof image === 'string') {
        results[index] = image
      } else {
        results[index] = image
      }

      if (results.filter(r => r).length === imageURLs.length) {
        onLoaded && onLoaded(results)
      }
    })
  })
}

function getValidIndex (index, length) {
  if (index >= 0) {
    index %= length
  } else {
    index = (length + index % length) % length
  }
  return index
}

function loadImage (imageURL, onLoaded) {
  let image = new Image()
  image.onload = onLoaded(image)
  image.crossOrigin = true
  image.src = imageURL
}


/***/ })
/******/ ]);