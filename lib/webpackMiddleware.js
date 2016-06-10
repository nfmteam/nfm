'use strict';

const webpack = require('webpack');
const webpackMiddleware = require('koa-webpack-dev-middleware');
const config = require('../webpack.config');

module.exports = function (app) {
    if (app.env !== 'development') {
        return;
    }

    app.use(webpackMiddleware(webpack(config), {
        publicPath: '/js/',

        stats: {
            colors: true
        }
    }));
};