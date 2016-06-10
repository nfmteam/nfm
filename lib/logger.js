'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');
const winston = require('winston');
const moment = require('moment');
const parse = require('co-body');

const config = require('./config');
const logDir = path.resolve(__dirname, '../', config['log.path'] || './logs');

function createLogger(debug) {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
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
                new winston.transports.File(infoOptions),
                new winston.transports.File(errorOptions)
            ]
        };

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

    options.filename = getFileName(options.filename || options.level || 'info');

    Object.assign(defaultOptions, options);

    return defaultOptions;
}

function getFileName(prefix) {
    var fileName = util.format('%s-%s.log', prefix, moment().format('YYYY.MM.DD'));

    return path.resolve(logDir, fileName);
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

Logger.prototype._noopFunction = function () {
    // do nothing
};

module.exports = new Logger();