'use strict';

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

var filename = IS_DEVELOPMENT ? 'bundle.js' : 'bundle.[hash].js';
var vendorname = IS_DEVELOPMENT ? 'vendor.js' : 'vendor.[hash].js';
var babelPlugins = IS_DEVELOPMENT ? [
    'transform-async-to-generator'
] : [
    'transform-async-to-generator',
    'transform-react-constant-elements',
    'transform-react-remove-prop-types',
    'transform-runtime'
];

var config = {
    entry: {
        app: getPath('script/index.js'),
        vendor: [
            'normalizr',
            'react',
            'react-dom',
            'react-redux',
            'redux',
            'redux-thunk',
            'redux-logger'
        ]
    },
    output: {
        path: getPath('script'),
        publicPath: '/script/',
        filename: filename
    },
    resolve: {
        modulesDirectories: [
            'node_modules'
        ]
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: [
                        'react',
                        'es2015'
                    ],
                    plugins: babelPlugins
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
        new webpack.optimize.CommonsChunkPlugin('vendor', vendorname)
    ]
};

if (IS_DEVELOPMENT) {
    config.devtool = 'eval-cheap-module-source-map';
} else {
    let assetsPluginInstance = new AssetsPlugin({
            path: 'assets',
            filename: '.assets.json'
        }),
        md5HashInstance = new WebpackMd5Hash();

    config.plugins = config.plugins.concat([
        md5HashInstance,
        assetsPluginInstance
    ]);
}

function getPath(jsPath) {
    return path.join(__dirname, jsPath);
}

module.exports = config;