'use strict';
let path = require('path');
var fs = require('fs');

let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

let rimraf = require('rimraf');

const NODE_ENV = process.env.NODE_ENV || 'development';
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 8080;
const context = path.join(__dirname, 'src');

function module_exists(name) {
  try {
    return require.resolve(name)
  }
  catch (e) {
    return false
  }
}

let options = {
  context: context,

  target: 'web',

  entry: [
    './app/index.module.js',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[hash:6].js',
    library: '[name]'
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components', context],
    extensions: [
      '.ts',
      '.js',
      '.json',
      '.css',
      '.html',
      ''
    ]

  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    modulesTemplates: ['*-loader', '*'],
    extensions: ['', '.js']
  },

  // =====================================
  module: {
    preLoaders: [],

    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        query: {
          'ignoreDiagnostics': [
            2403, // 2403 -> Subsequent variable declarations
            2300, // 2300 -> Duplicate identifier
            2374, // 2374 -> Duplicate number index signature
            2375  // 2375 -> Duplicate string index signature
          ]
        },
        exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel?presets[]=es2015'
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.json/,
        exclude: /node_modules/,
        loader: "json"
      },
      {
        test: /\.(png|jpg|svg)$/,
        exclude: /node_modules/,
        loader: 'file?name=assets/images/[name].[hash:6].[ext]'
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        exclude: /node_modules/,
        loader: 'file?name=assets/fonts/[name].[hash:6].[ext]'
      },
    ]
  },

  // =====================================
  plugins: [
    {apply: (compiler) => rimraf.sync(compiler.options.output.path)},

    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),

    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      APP_NAME: JSON.stringify(require('./package.json').name || 'app')
    }),

    new CopyWebpackPlugin(
      fs.readdirSync(context)
        .filter(file=> fs.statSync(path.join(context, file)).isFile())
        .map(name=>({from: path.join(context, name)}))
    )
  ],

  noParse: [
    /[\/\\]node_modules[\/\\]angular[\/\\]angular\.js$/
  ]
};

// =====================================

if (NODE_ENV == 'development') {
  options.watch = true;
  options.watchOptions = {
    aggregateTimeout: 100
  };
  options.devServer = {
    devtool: "source-map",
    contentBase: "dist",
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    },
    host: HOST,
    port: PORT
  };

  options.module.exprContextCritical = false;
  options.output.filename = '[name].js';
  if (process.env.NODE_PROFILE) {
    options.debug = true;
    options.profile = true;
  }
} else if (NODE_ENV == 'production') {
  options.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
  options.plugins.push(new webpack.optimize.DedupePlugin());
  options.plugins.push(new ExtractTextPlugin('[name].[hash:6].css'));
  options.plugins.push(new webpack.NoErrorsPlugin());
}

if (module_exists('open-browser-webpack-plugin')) {
  options.plugins.push(new (require('open-browser-webpack-plugin'))({url: 'http://' + HOST + ':' + PORT + options.output.publicPath}));
}

if (module_exists('unused-files-webpack-plugin')) {
  options.plugins.push(new (require("unused-files-webpack-plugin").default)());
}

if (module_exists('jshint-loader')) {
  options.module.preLoaders.push({
    test: /\.js$/,
    exclude: /node_modules|bower_modules/,
    loader: 'jshint'
  });
}

if (module_exists('tslint-loader')) {
  options.module.preLoaders.push({
    test: /\.ts$/,
    exclude: /node_modules|bower_modules/,
    loader: 'tslint'
  });
}

module.exports = options;
