const { merge } = require('webpack-merge');
const config = require('./webpack.config');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(config, {
  entry: './src/js/index.js',
  mode: 'production',
  devtool: false,
  performance: {
    maxEntrypointSize: 90000,
    maxAssetSize: 900000
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
            
          },
        //   compress: { 
        //     pure_funcs: [
        //         'console.log', 
        //         'console.info', 
        //         'console.debug', 
        //         'console.warn'
        //     ] 
        // } 
        },
        extractComments: false,
      }),
    ],
  },
})
