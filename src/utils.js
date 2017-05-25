export function loadImages (imageURLs, onLoaded) {
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

export function getValidIndex (index, length) {
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
