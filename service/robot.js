'use strict';

const fs = require('../utils/fsHelper').fsExtra;
const async = require('async');
const logger = require('../lib/logger');
const backup = require('./backup');
const deployer = require('./deployer');
const uploader = require('./uploader');

const config = require('../config');
const baseDir = config['fs.base'];

// 总文件数
var totalFileCount = 0;

// 总文件大小
var totalFileSize = 0;

// 具体的类型文件统计
var fileTypeStat = {};

// "其他文件类型"的key
const otherFileTypeExtname = 'OTHER_FILE';

// 入口函数
function main() {
  walk(baseDir)
    .then(paths => async.waterfall([
      // 执行清理
      async.apply(clean, paths),
      async.apply(collectStat, paths)
    ]))
    .catch(error => {
      logger.error('[Robot Error]', error);
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

/**
 * 清理规则:
 *  过多的备份(大于MaxSize)
 *  空备份文件夹
 *  无效的待发布文件(大于keeptime)
 *  无效的上传文件(大于keeptime)
 */
function clean(paths, callback) {
  logger.info('[Robot]', '清理开始');

  async.eachSeries(paths, function (path, done) {
    uploader.clean()
      .then(() => backup.clean(path))
      .then(() => backup.cleanFile(path))
      .then(() => deployer.clean(path))
      .then(() => done());
  }, function () {
    logger.info('[Robot]', '清理结束');
    callback();
  });
}

/**
 * 执行统计, 统计文件大小, 数量
 */
function collectStat(paths, callback) {
  logger.info('[Robot]', '统计开始');

  async.eachSeries(paths, function (path, done) {
    fs.statAsync(path)
      .then(stat => {
        var extname = path.extname(path).substring(1).toLowerCase()
          || otherFileTypeExtname;
        var size = stat.size;

        // 统计信息不存在该文件, 则新建
        if(!fileTypeStat[extname]) {
          fileTypeStat[extname] = {
            count: 0,
            size: 0
          }
        }

        // 执行统计
        totalFileCount++;
        totalFileSize = totalFileSize + size;
        fileTypeStat[extname].count++;
        fileTypeStat[extname].size = fileTypeStat[extname].size + size;
      })
      .catch(() => {
        // 文件不存在等错误;
        done();
      });
  }, function () {
    logger.info('[Robot]', '统计结束');
    callback();
  });
}

module.exports = main;