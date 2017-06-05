Play a series of images as sprite animation. It can be render into DOM or canvas.

### Demo

[live demo](https://jackgit.github.io/image-sprite/index.html)

### Install

npm install:

```bash
npm i image-sprite --save
```

included in `script`:

```html
<script src="image-sprite.min.js"></script>
```

### Usage

```js
var imageSprite = new ImageSprite('mountNode', {
  width: 300,
  height: 300,
  images: [], // urls of your images
  mode: 'canvas',
  interval: 16,
  onLoaded: null, // once all images are loaded, will trigger this callback
  onUpdate: null, // will be invoked per frame while playing
  onComplete: null  // will be invoked once playing completed
})

imageSprite.play()  // play, by default is looping play, equals to play({ loop: true })
imageSprite.play({ repeat: 2 }) // play twice
imageSprite.play({ toFrame: 1 }) // play to the frame which index is 1
imageSprite.play({ byFrame: 10 }) // play of next 10 frames

/* you can specify direction and interval of this play */
imageSprite.play({ interval: 1000, direction: 'backward' }) // direction values: 'forward', 'backward', 'alternate'

imageSprite.pause() // pause

imageSprite.next()  // next frame

imageSprite.prev()  // prev frame

imageSprite.jump(frameIndex) // jump to a specified frame

imageSprite.destroy()
```
