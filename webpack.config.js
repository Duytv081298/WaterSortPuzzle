
const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
module.exports = {
  entry: './src/js/index_local.js',
  output: {
    filename: '[name].js',
    path: path.resolve('build'),
    clean: true
  },
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  devtool: "eval-source-map",
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },

  devServer: {
    compress: true,
    port: 8080,
  },
  plugins: [
    new webpack.DefinePlugin({
      'CANVAS_RENDERER': JSON.stringify(true),
      'WEBGL_RENDERER': JSON.stringify(true)
    }),
    new HtmlWebpackPlugin(
      {
        filename: 'index.html',
        template: 'src/index.html',
        title: 'Pixi',
      }
    ),
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/assets'),
          to: path.resolve('build/assets')
        },
        {
          from: path.resolve('fbapp-config.json'),
          to: path.resolve('build')
        }
      ],
    })],


}