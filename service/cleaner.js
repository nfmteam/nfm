'use strict';

const fs = require('../utils/fsHelper').fsExtra;
const async = require('async');
const backup = require('./backup');
const deployer = require('./deployer');
const uploader = require('./uploader');

const config = require('../config');
const baseDir = config['fs.base'];

/**
 * 清理规则:
 *
 *    - 过多的备份(大于MaxSize)
 *    - 空备份文件夹
 *    - 无效的待发布文件(大于keeptime)
 *    - 无效的上传文件(大于keeptime)
 */

function cleaner() {
  walk(baseDir)
    .then(paths => {
      async.eachSeries(paths, function (path, done) {
        clean(path).then(() => done());
      });
    });
}

// 获取全部目录
function walk(dir) {
  return new Promise((resolve, reject) => {
    var paths = [];

    fs.walk(dir)
      .on('data', function ({ path, stats }) {
        if (stats.isDirectory()) {
          paths.push(path);
        }
      })
      .on('error', function (error) {
        reject(error);
      })
      .on('end', function () {
        resolve(paths);
      });
  });
}

// 执行清理
function clean(path) {
  return uploader.clean()
    .then(() => backup.clean(path))
    .then(() => backup.cleanFile(path))
    .then(() => deployer.clean(path))
}

module.exports = cleaner;