"use strict";

const path = require('path'),
      webpack = require('webpack');

module.exports = {
  entry: [
    './client/index'
  ],
  output: {
    path: './dest/app',
    publicPath: '/app/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'client')
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: true,
      sourcemap: false,
      beautify: false,
      dead_code: true
    }),
    new webpack.optimize.DedupePlugin()
  ]
}
