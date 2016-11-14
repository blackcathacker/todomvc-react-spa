var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    './client/app.js'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel"
      }
    ]
  },
  devServer: {
    contentBase: "build",
    port: 5002,
  }
}
