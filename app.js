'use strict';

const koa = require('koa');
const app = koa();
const serve = require('koa-static');
const Pug = require('koa-pug');

const config = require('./config');
const error = require('./lib/error');
const bodyParser = require('./lib/bodyParser');
const webpack = require('./lib/webpackMiddleware');
const apiRouter = require('./routes/api');
const pageRouter = require('./routes/page');
const logger = require('./lib/logger');
const assets = require('./assets/.assets.json');

// static serve
app.use(serve('assets'));

// webpack
webpack(app);

// logger
logger.register(app);
app.use(logger.useGlobalLogger());

// exception handler
app.use(error);

// view engine
const IS_DEVELOPMENT = app.env === 'development';
const defaultAssets = {
  app: { js: '/script/bundle.js' },
  vendor: { js: '/script/vendor.js' }
};
const pug = new Pug({
  viewPath: './views',
  basedir: './views',
  noCache: IS_DEVELOPMENT,
  debug: IS_DEVELOPMENT,
  app: app,
  locals: IS_DEVELOPMENT ? defaultAssets : assets
});

// bodyParser
app.use(bodyParser);

// router
app.use(apiRouter.routes());
app.use(pageRouter.routes());

if (require.main === module) {
  // istanbul ignore next
  // 开发&测试环境时覆盖
  app.listen(config['app.port'] || 3000);
} else {
  module.exports = app;
}