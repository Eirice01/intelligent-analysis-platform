/*
 * Created on Mon Nov 28 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { name } = require('../package.json');
const { ROOT } = require('./tools');
const { CONFIG, _src, _mocks } = require('./config-common');

const entry = { app: ROOT('src', 'index.js') };

// TODO BY LIJIAHAO
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const devServer = {
  host: "0.0.0.0",
  open: true,
  progress: true,
  compress: false,
  port: 3000,
  disableHostCheck: true,
  contentBase: [ _src, _mocks],
  proxy: {
    '/api': {
     target: 'http://192.168.1.94:8200/api',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    }
  }
};

const plugins = origin => smp.wrap([
  new webpack.EnvironmentPlugin({
    USE_MOCK_SERVICE: false
  }),
  ...origin,
  new HtmlWebpackPlugin({
    title: name,
    template: ROOT('public', 'index.html'),
    inject: 'body',
    chunks: ['app']
  })
]);

const configs = CONFIG({
  mode: 'development',
  entry,
  devtool: "source-map",
  target: 'web',
  devServer,
  plugins
});

// console.log(configs);

module.exports = configs;
