'use strict';

const koa = require('koa');
const app = koa();
const serve = require('koa-static');
const Pug = require('koa-pug');

const config = require('./config');
const exceptionHandler = require('./exceptionHandler');
const bodyParser = require('./bodyParser');
const webpack = require('./webpackMiddleware');
const apiV1Router = require('./routes/api.v1');
const pageRouter = require('./routes/page');
const logger = require('./logger');
const assets = require('../assets/.assets.json');

// logger
logger.register(app);
app.use(logger.useGlobalLogger());

// exception handler
app.on('error', function (error) {
    app.context.error(error);
});
app.use(exceptionHandler.errorHandler);
app.use(exceptionHandler.notfoundHandler);

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

// webpack
webpack(app);

// static serve
app.use(serve('assets'));

// bodyParser
app.use(bodyParser);

// router
app.use(apiV1Router.routes());
app.use(pageRouter.routes());

app.listen(config['app.port'] || 3000);