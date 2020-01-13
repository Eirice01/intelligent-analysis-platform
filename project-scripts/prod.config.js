/*
 * Created on Mon Nov 28 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// TODO BY LIJIAHAO
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { name } = require('../package.json');
const { ROOT, SRC } = require('./tools');
const { CONFIG, _mocks, rules } = require('./config-common');

const entry = { app: ROOT('src', 'index.js') };

const USE_MOCK_SERVICE = process.argv.some(arg => arg === '--use-mock-service')
const MOCK_SERVICE_BASE = "mocks";
const API = '/ebm-plus/1.0';

const output = 'build';

const configs = CONFIG({
  mode: 'production',
  entry,
  devtool: 'cheap-module-eval-source-map',
  target: 'web',
  output: {
    path: ROOT(output),
    filename: '[name].[hash].js'
  },
  // module rules
  module: origin => {
    rules.set('babel', { use: ['babel-loader'] });
    rules.set('css', { use: [MiniCssExtractPlugin.loader, 'css-loader'] });
    rules.set('less', { use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] });

    return  { ...origin, rules: rules.toArray() };
  },
  resolve: orgin_resolve => {
    orgin_resolve.alias['mobx'] = 'mobx/lib/mobx.min.js';
    console.log('orgin_resolve', orgin_resolve)
    return orgin_resolve
  },
  // plugins
  plugins: origin => [
    ...origin,
    new webpack.EnvironmentPlugin({
      USE_MOCK_SERVICE,
      MOCK_SERVICE_BASE,
      API
    }),
    new CopyPlugin([
      { from: SRC('service-worker.js'), to: ROOT(output, '[name].[ext]')},
    ].concat(USE_MOCK_SERVICE ? [{ from: _mocks, to: ROOT(output, 'mocks')}] : [])),
    new HtmlWebpackPlugin({
      title: name,
      template: ROOT('public', 'index.html'),
      inject: 'body',
      chunks: ['app']
    }),
    new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
    new webpack.SourceMapDevToolPlugin(),
    // TODO BY LIJIAHAO
    new webpack.ProgressPlugin(),
    new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin()
  ],
  // optimizations
  optimization: {
    minimize: false,
    mergeDuplicateChunks: true,
    minimizer: [
      new TerserPlugin({ parallel: true, cache: true, sourceMap: true }),
      new OptimizeCSSAssetsPlugin({}),
      new UglifyJSPlugin()
    ]
  },

});

module.exports = configs;
