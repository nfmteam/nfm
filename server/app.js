'use strict';

const koa = require('koa');
const app = koa();
const favicon = require('koa-favicon');
const serve = require('koa-static');
const path = require('path');

const config = require('./config');
const router = require('./router');
const logger = require('./lib/logger');
const exceptionHandler = require('./lib/exceptionHandler');

// logger
logger.register(app);

// exception handler
app.on('error', function (error) {
    app.context.error(error);
});
app.use(exceptionHandler.errorHandler);
app.use(exceptionHandler.notfoundHandler);

// favicon.ico
app.use(favicon(path.resolve(__dirname, './public/favicon.ico')));

// router
app.use(router.routes());

// static serve
app.use(serve(path.resolve(__dirname, '../client')));

app.listen(config['app.port'] || 3000);