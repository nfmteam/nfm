const Promise = require('bluebird');
const fsExtra = require('fs-extra');
const fs = Promise.promisifyAll(fsExtra);

module.exports = fs;