module.exports = {
  entry: './client/src/index_page.js',
  mode: 'production',
  output: {
    filename: 'script.js',
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