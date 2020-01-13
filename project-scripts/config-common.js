/*
 * Created on Mon Nov 28 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

const { ROOT, SRC, FRAMESET } = require('./tools');

const [_root, _src, _index, _dist, _mocks] = [ROOT(), SRC(), SRC('index.js'), ROOT('dist'), ROOT('mocks')];

const alias = FRAMESET.reduce((a, { name, item }) => (a[`@${name}`] = item, a) , {
  '@antd-css': 'antd/dist/antd.css',
  '@antd-lib': 'antd',
  '@images': SRC('assets', 'images'),
  '@src': _src
});

const rules = {
  _items_: {
    eslint: {
      test: /\.(js|conf)$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      options: {
        failOnWarning: true
      },
      exclude: /node_modules|(\.min\.js)/
    },
    babel: {
      test: /\.(js|conf)$/,
      use: 'babel-loader',
      exclude: /node_modules|\.min\.js/
    },
    css: {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    less: {
      test: /\.less$/,
      use: ['style-loader', { loader: 'css-loader', options: { sourceMap: false } }, 'less-loader']
    },
    png_jpg_etc: {
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: [{ loader: 'url-loader', options: { limit: 10000 } }]
    }
  },
  get: function(name) {
    return this._items_[name];
  },
  set: function(name, rule) {
    const raw = this.get(name) || {};
    if(!rule)
      delete this._items_[name];
    else
      this._items_[name] = { ...raw, ...rule };
  },
  toArray() {
    return Object.keys(this._items_).map(i => this._items_[i]);
  }
};

const externals = ['antd']

// WEBPACK COMMONS CONFIGURATIONS

const commons = {
  entry: ['@babel/runtime-corejs2', _index],
  output: {
    path: _dist,
    filename: '[name].js'
  },
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    alias,
    symlinks: false,
    modules: [_src, 'node_modules'],
    extensions: ['*', '.js', '.json']
  },
  module: {
    rules: rules.toArray()
  },
  plugins: [ ],
  stats: {
    colors: true,
    entrypoints: false
  },
  externals
};

const CONFIG = (options) => options ? Object.keys(options).reduce((commons, name) => {
  const common = commons[name];
  const custom = options[name];

  if(typeof custom === 'function') {
    commons[name] = custom(common);
    return commons;
  }

  if(custom) {
    commons[name] = custom;
    return commons;
  }

  return commons;
}, commons) : commons

module.exports = {
  CONFIG,
  _root, _src, _index, _dist, _mocks,
  rules
};
