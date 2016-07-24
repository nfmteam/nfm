'use strict';

const fs = require('../utils/fsHelper').fsExtra;
const config = require('../config');

const baseDir = config['fs.base'];

const uploadDir = config['upload.dir'];
const uploadKeeptime = config['upload.keepTime'];

const backupDir = config['backup.dir'];
const backupMaxSize = config['backup.maxSize'];

const deployDir = config['deploy.dir'];
const deployKeeptime = config['deploy.keepTime'];

/**
 * 清理规则:
 *
 *    - 过多的备份(大于MaxSize)
 *    - 空备份文件夹
 *    - 无效的待发布文件(大于keeptime)
 *    - 无效的上传文件(大于keeptime)
 */

/**
 * 待清理文件
 */
const backupItems = [];
const deployItems = [];
const uploadItems = [];

/**
 * Main
 */
function cleaner(done) {
  // walk upload dir

  // walk backup & deploy dir
}

/**
 * 清理上传文件
 */
function cleanUpload() {
  // ...
}

/**
 * walk
 */
function walk(path) {
  return fs.readdirAsync(path)
    .then(fileNames => Promise.all(
      fileNames.map(fileName => this.getStat(`${path}/${fileName}`))
    ));
}

/**
 * get file stat
 */
function getStat(path) {
  return fs.statAsync(path);
}

/**
 * 执行清理
 */
function clean() {
  // ...
}

// module.exports = cleaner;
cleaner();