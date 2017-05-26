var webpack = require('webpack')

module.exports = {
  entry: {
    'image-sprite': './src/image-sprite.js'
  },
  output: {
    filename: './dist/[name].min.js',
    library: 'ImageSprite',
    libraryTarget: 'umd'
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin()
  ]
}
