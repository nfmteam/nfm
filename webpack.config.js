'use strict';

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

function getPath(jsPath) {
    return path.join(__dirname, jsPath);
}

module.exports = {
    entry: {
        'app': getPath('assets/app.js')
    },
    output: {
        path: getPath('assets/'),
        publicPath: '/js/',
        filename: '[name].[hash].js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new WebpackMd5Hash(),
        new AssetsPlugin({
            filename: 'assets.json'
        })
    ],
    devtool: IS_DEVELOPMENT ? 'source-map' : ''
};