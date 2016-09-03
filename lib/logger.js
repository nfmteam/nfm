'use strict';

const path = require('path');
const fs = require('fs-extra');
const util = require('util');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');

const config = require('../config');
const logDir = config['log.path'];

function createLogger(debug) {
  if (!fs.existsSync(logDir)) {
    fs.ensureDirSync(logDir);
  }

  var infoOptions = getDefaultConfig({
      name: 'info-log',
      filename: 'info',
      level: 'info'
    }),
    errorOptions = getDefaultConfig({
      name: 'error-log',
      filename: 'error',
      level: 'error',
      logstash: false,
      json: false,
      prettyPrint: true
    }),
    options = {
      exitOnError: false,
      levels: winston.config.syslog.levels,
      transports: [
        new DailyRotateFile(infoOptions),
        new DailyRotateFile(errorOptions)
      ]
    };

  // istanbul ignore next
  // 本地debug, 忽略测试
  if (debug) {
    options.transports.push(
      new winston.transports.Console({
        colorize: true,
        prettyPrint: true,
        timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        stderrLevels: ['info', 'error']
      })
    );
  }

  return new winston.Logger(options);
}

function getDefaultConfig(options) {
  var defaultOptions = {
    name: 'info-log',
    level: 'info',
    logstash: true,
    timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    maxsize: config['log.maxsize'] || 1024 * 1024 * 100
  };

  options.filename = getFileName(options.filename);
  options.datePattern = '.yyyy-MM-dd.log';

  Object.assign(defaultOptions, options);

  return defaultOptions;
}

function getFileName(prefix) {
  return path.resolve(logDir, prefix);
}

function Logger() {
  var logger,
    debug = process.env.NODE_ENV === 'development';

  if (config['log.enable']) {
    logger = createLogger(debug);
    this.info = logger.info;
    this.error = logger.error;
  } else {
    this.info = this._noopFunction;
    this.error = this._noopFunction;
  }
}

Logger.prototype.register = function (app) {
  Object.assign(app.context, {
    info: this.info,
    error: this.error
  });
};

Logger.prototype.useGlobalLogger = function () {
  return config['log.global.enable']
    ? this._globalLogger
    : this._noopGenerator;
};

Logger.prototype._globalLogger = function *(next) {
  var start = Date.now();

  yield next;

  var end = Date.now(),
    req = this.request,
    path = req.href,
    method = this.method,
    ip = this.request.ip,
    ua = this.request.get('User-Agent'),
    requestData = req.method === 'GET' ? req.querystring : this.request.body,
    body = this.body,
    logData;

  logData = {
    responseTime: end - start,
    method,
    path,
    ip,
    ua,
    requestData,
    body: this.response.is('json') ? body : this.type
  };

  this.info('[Global]', logData);
};

Logger.prototype._noopGenerator = function *(next) {
  yield next;
};

Logger.prototype._noopFunction = function () {
  // do nothing
};

module.exports = new Logger();
