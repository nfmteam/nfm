'use strict';

const koa = require('koa');
const app = koa();
const serve = require('koa-static');
const Pug = require('koa-pug');

const webpack = require('./webpackMiddleware');
const config = require('./config');
const router = require('./router');
const logger = require('./logger');
const exceptionHandler = require('./exceptionHandler');
const assets = require('../assets/.assets.json');

// logger
logger.register(app);

// exception handler
app.on('error', function (error) {
    app.context.error(error);
});
app.use(exceptionHandler.errorHandler);
app.use(exceptionHandler.notfoundHandler);

// view engine
const IS_DEVELOPMENT = app.env === 'development';
const pug = new Pug({
    viewPath: './views',
    basedir: './views',
    noCache: IS_DEVELOPMENT,
    debug: IS_DEVELOPMENT,
    app: app,
    locals: IS_DEVELOPMENT ? {app: {js: '/script/bundle.js'}} : assets
});

// router
app.use(router.routes());

// webpack
webpack(app);

// static serve
app.use(serve('assets'));

app.listen(config['app.port'] || 3000);