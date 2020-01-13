/*
 * Created on Thu Apr 25 2019
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */
const { rules } = require('./config-common');
const devConfig  = require('./dev.config');

const configs = {
  ...devConfig,
  resolve: {
    ...devConfig.resolve,
    symlinks: true
  },
  module: {
    rules: (rules.set('eslint', null), rules.toArray())
  }
};

module.exports = configs;
