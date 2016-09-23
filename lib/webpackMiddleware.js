'use strict';

// istanbul ignore next
// webpack是本地调试用的, 忽略
module.exports = function (app) {
  if (app.env !== 'development') {
    return;
  }

  /* eslint-disable global-require */
  const webpack = require('webpack');
  const webpackMiddleware = require('koa-webpack-dev-middleware');
  const config = require('../assets/webpack.config');
  /* eslint-enable global-require */

  app.use(webpackMiddleware(webpack(config), {
    publicPath: '/script/',

    stats: {
      colors: true
    }
  }));
};