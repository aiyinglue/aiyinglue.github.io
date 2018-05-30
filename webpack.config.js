const {
  resolve
} = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const url = require('url')
const publicPath = ''
var srcCatalog = "./webrc/"

module.exports = (options = {}) => ({
  entry: {
    "build": [srcCatalog + '/app.js', srcCatalog + '/styles/common.scss']
  },
  output: {
    path: resolve(__dirname, 'www/dist'),
    publicPath: '/dist/',
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': resolve(__dirname, srcCatalog),
      '@scss': resolve(__dirname, srcCatalog, 'styles'),
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            //scss: 'style-loader!css-loader!sass-loader'
            //scss:ExtractTextPlugin.extract(['style-loader','css-loader','sass-loader'])
            scss: ExtractTextPlugin.extract({
              use: ['css-loader', 'sass-loader'],
              fallback: 'style-loader'
            }),
            sass: ExtractTextPlugin.extract({
              use: ['css-loader', 'sass-loader'],
              fallback: 'style-loader'
            }),
            css: ExtractTextPlugin.extract({
              use: ['css-loader'],
              fallback: 'vue-style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
            })
          }
        }
      }, {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }, {
        test: /\.jade$/,
        use: ['jade-loader']
      }, {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            root: resolve(__dirname, 'src'),
            attrs: ['img:src', 'link:href']
          }
        }]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader']
        })
      }, {
        test: /favicon\.png$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }]
      }, {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '',
      hash: true,
      template: srcCatalog + 'index.ejs',
      filename: '../index.html'
    }),
    new CopyWebpackPlugin([{
      from: srcCatalog + 'i18n/',
      to: 'i18n'
    }, {
      from: srcCatalog + '/cfgbak',
      to: '../cfgbak'
    }, {
      from: srcCatalog + '/default.html',
      to: '../default.html'
    }, {
      from: srcCatalog + 'images/svg/',
      to: 'images/svg'
    }, {
      from: srcCatalog + 'um/',
      to: 'um'
    }, {
      from: srcCatalog + '/favicon.ico',
      to: '../favicon.ico'
    }]),
    new ExtractTextPlugin({
      filename: options.dev ? '[name].css' : '[name].css?[chunkhash]',
      allChunks: true
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor/vendor-manifest.json')
    })
  ],

  devServer: {
    contentBase: resolve(__dirname, "www"),
    host: '127.0.0.1',
    port: 8018,
    proxy: {
      '/jrd/webapi': {
        target: 'http://127.0.0.1:9096'
      },
      '/smartreleaseapi': {
        target: 'http://127.0.0.1:8000',
      },
      '/goform/uploadBackupSettings': {
        target: 'http://127.0.0.1:9096'
      },
      '/goform/activatePicopoint': {
        target: 'http://127.0.0.1:9096'
      }
    }
  },
  //devtool: options.dev ? '#eval-source-map' : '#source-map'
})