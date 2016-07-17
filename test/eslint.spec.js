'use strict';

const lint = require('mocha-eslint');

var paths = [
  'assets/**/*.js',
  '!assets/script/bundle.*.js',
  'controllers',
  'lib',
  'routes',
  'service',
  'utils',
  '*.js'
];

var options = {
  formatter: 'compact',
  alwaysWarn: false,
  timeout: 10000,
  slow: 1000,
  strict: true
};

lint(paths, options);