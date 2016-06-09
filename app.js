'use strict';

const koa = require('koa');
const app = koa();
const favicon = require('koa-favicon');
const Pug = require('koa-pug');

const config = require('./config');
const router = require('./router');
const logger = require('./lib/logger');
const exceptionHandler = require('./lib/exceptionHandler');

const IS_DEVELOPMENT = app.env === 'development';

// logger
logger.register(app);
app.use(logger.useGlobalLogger());

// exception handler
app.on('error', function (error) {
    app.context.error(error);
});
app.use(exceptionHandler.errorHandler);
app.use(exceptionHandler.notfoundHandler);

// favicon.ico
app.use(favicon('./public/favicon.ico'));

// view engine
const pug = new Pug({
    viewPath: './views',
    basedir: './views',
    noCache: IS_DEVELOPMENT,
    debug: IS_DEVELOPMENT,
    app: app
});

// router
app.use(router.routes());

app.listen(config['app.port'] || 3000);