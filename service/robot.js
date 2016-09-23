'use strict';

const path = require('path');
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

// 总目录数
var totalDirCount = 0;

// 总占用大小
var totalSize = 0;

// 具体的类型文件统计
var fileTypeStat = {};

// "其他文件类型"的key
const otherFileTypeExtname = 'OTHER_FILE';

/**
 * 入口函数
 */
function main() {
  return walk(baseDir)
    .then(({ dirPaths, filePaths }) => new Promise((resolve, reject) => {
      async.waterfall([
        // 执行清理
        async.apply(clean, dirPaths),

        // 执行统计
        async.apply(collectStat, dirPaths, filePaths)
      ], function (error) {
        if (error) {
          reject(error);
        }

        const result = {
          totalFileCount,
          totalDirCount,
          totalSize,
          fileTypeStat,
          otherFileTypeExtname
        };

        logger.info('[Robot Result]', result);
        resolve(result);
      })
    }))
    .catch(error => {
      logger.error('[Robot Error]', error);
    });
}

/**
 * 获取全部目录&文件
 */
function walk(dir) {
  return new Promise((resolve, reject) => {
    var filePaths = [];
    var dirPaths = [];

    fs.walk(dir)
      .on('data', function ({ path, stats }) {
        if (stats.isDirectory()) {
          path !== baseDir && dirPaths.push(path);
        } else {
          filePaths.push(path);
        }
      })
      .on('error', function (error) {
        reject(error);
      })
      .on('end', function () {
        resolve({
          dirPaths,
          filePaths
        });
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
function clean(dirPaths, callback) {
  logger.info('[Robot]', '清理开始');

  async.eachSeries(dirPaths, function (_path, done) {
    uploader.clean()
      .then(() => backup.clean(_path))
      .then(() => backup.cleanFile(_path))
      .then(() => deployer.clean(_path))
      .then(() => done());
  }, function () {
    logger.info('[Robot]', '清理结束');
    callback();
  });
}

/**
 * 执行统计, 统计文件大小, 数量
 */
function collectStat(dirPaths, filePaths, callback) {
  logger.info('[Robot]', '统计开始');

  const paths = dirPaths.concat(filePaths);

  async.eachSeries(paths, function (_path, done) {
    fs.statAsync(_path)
      .then(stat => {
        var extname, size = stat.size;
        totalSize = totalSize + size;

        if (stat.isDirectory()) {
          totalDirCount++;
        } else {
          extname = path.extname(_path).substring(1).toLowerCase() || otherFileTypeExtname;

          // 统计信息不存在该文件, 则新建
          if (!fileTypeStat[extname]) {
            fileTypeStat[extname] = {
              count: 0,
              size: 0
            }
          }

          totalFileCount++;
          fileTypeStat[extname].count++;
          fileTypeStat[extname].size = fileTypeStat[extname].size + size;
        }

        done();
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