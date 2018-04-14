var webpack = require('webpack');

module.exports = {
  entry: {
    index_page: './client/src/index_page.js',
    wwa_page: './client/src/wwa_page.js'
  },
  mode: 'development',
  output: {
    filename: '[name].js',
    path: __dirname + '/client'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: { url: false }
        }]
      }
    ]
  }
};