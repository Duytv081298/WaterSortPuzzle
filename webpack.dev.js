const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const config = require('./webpack.config');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(config, {
  entry: './src/js/index.js',
  mode: 'development',
  devServer: {
    compress: true,
    https: true,
    port: 8080
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.FB_ENV': JSON.stringify(true)
    })
  ]
})