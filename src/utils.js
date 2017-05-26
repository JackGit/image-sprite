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
