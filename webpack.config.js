'use strict';

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

var filename = IS_DEVELOPMENT ? 'bundle.js' : 'bundle.[hash].js';
var babelPlugins = IS_DEVELOPMENT ? [] : [
    'transform-react-constant-elements',
    'transform-react-remove-prop-types',
    'transform-runtime'
];

var config = {
    entry: {
        'app': getPath('assets/index.js')
    },
    output: {
        path: getPath('assets/js'),
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
    }
};

if (IS_DEVELOPMENT) {
    config.devtool = 'eval-cheap-module-source-map';
} else {
    let definePluginInstance = new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        assetsPluginInstance = new AssetsPlugin({
            filename: 'assets.json'
        }),
        md5HashInstance = new WebpackMd5Hash();

    config.plugins = [
        definePluginInstance,
        md5HashInstance,
        assetsPluginInstance
    ];
}

function getPath(jsPath) {
    return path.join(__dirname, jsPath);
}

module.exports = config;