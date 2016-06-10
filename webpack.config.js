'use strict';

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

var filename = IS_DEVELOPMENT ? '[name].js' : '[name].[hash].js';
var babelPlugins = IS_DEVELOPMENT ? [] : [
    'transform-react-constant-elements',
    'transform-react-remove-prop-types',
    'transform-runtime'
];

var assetsPluginInstance = new AssetsPlugin({
    filename: 'assets.json'
});

var config = {
    entry: {
        'app': getPath('assets/app.js')
    },
    output: {
        path: getPath('assets/'),
        publicPath: '/js/',
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
        assetsPluginInstance
    ]
};

if (IS_DEVELOPMENT) {
    let definePluginInstance = new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    });

    let md5HashInstance = new WebpackMd5Hash();

    config.plugins.unshift(md5HashInstance);
    config.plugins.unshift(definePluginInstance);

    config.devtool = 'eval-cheap-module-source-map';
}

function getPath(jsPath) {
    return path.join(__dirname, jsPath);
}

module.exports = config;