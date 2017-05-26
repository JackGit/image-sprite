module.exports = {
  entry: {
    'image-sprite': './src/image-sprite.js'
  },
  output: {
    filename: './dist/[name].js',
    library: 'ImageSprite',
    libraryTarget: 'umd'
  }
}
