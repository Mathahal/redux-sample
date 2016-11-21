var webpack = require('webpack'),
    path = require('path'),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: {
    index: path.join( __dirname, './src/entry.js' ),
  },
  output: {
    path: path.join( __dirname, './dist' ),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|.git)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8888/',
      files: ["./*.html", "./*.php", "./src"]
    },{
      reload: true
    })
  ]
}
