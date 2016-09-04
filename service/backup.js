'use strict';

const Promise = require('bluebird');
const fs = require('../utils/fsHelper').fsExtra;
const path = require('path');
const config = require('../config');

const deployDir = config['deploy.dir'];
const backupDir = config['backup.dir'];
const backupMaxSize = config['backup.maxSize'];

module.exports = {

  /**
   * 添加备份文件
   */
  add: function (absFilePath) {
    var { dir, base } = path.parse(absFilePath);
    var absBackupFilePath = `${dir}/${backupDir}/${base}/${Date.now()}.bak`;
    var currentBackupDir = this.getCurrentBackupDir(absFilePath);

    return fs.ensureDirAsync(currentBackupDir)
      .then(() => fs.copyAsync(absFilePath, absBackupFilePath));
  },

  /**
   * 获取备份列表
   */
  getBackupList: function (absDir) {
    return fs.readdirAsync(`${absDir}/${backupDir}`);
  },

  /**
   * 获取备份文件列表
   */
  getBackupFileList: function (absBackupDir) {
    return fs.readdirAsync(absBackupDir);
  },

  /**
   * 执行恢复(到待发布模式)
   */
  restore: function (absFilePath, absBackupPath) {
    var { dir, base } = path.parse(absFilePath),
      absDeployDir = `${dir}/${deployDir}`,
      absDeployFilePath = `${absDeployDir}/${base}`;

    return fs.ensureDirAsync(absDeployDir)
      .then(() => fs.copyAsync(absBackupPath, absDeployFilePath, {
        clobber: true
      }));
  },

  /**
   * 清理备份(文件已不存在,删除备份)
   *
   * @param absPath 将会清理这个路径下的备份目录
   * @returns {Promise.<*>}
   */
  clean: function (absPath) {
    var absBackupDir = `${absPath}/${backupDir}`;

    return Promise
      .all([
        fs.readdirAsync(absPath).catchReturn([]),
        fs.readdirAsync(absBackupDir).catchReturn([])
      ])
      .then(([files, backupDirs]) => backupDirs.filter(backupDir => !files.includes(backupDir)))
      .then(backupDirs => Promise.all(
        backupDirs.map(backupDir => fs.removeAsync(`${absBackupDir}/${backupDir}`))
      ));
  },

  /**
   * 清理备份文件(备份数大于MaxSize)
   *
   * @param absPath 清理该目录下的备份文件
   * @returns {Promise.<*>}
   */
  cleanFile: function (absPath) {
    var absBackupDir = `${absPath}/${backupDir}`;

    return fs.readdirAsync(absBackupDir)
      .catchReturn(Promise.resolve([]))
      .then(backupDirs => Promise.all(
        backupDirs.map(dir => this._cleanFile(`${absBackupDir}/${dir}`))
      ));
  },

  _cleanFile: function (absBackupFilePath) {
    return fs.readdirAsync(absBackupFilePath)
      .then(files => files.sort().reverse().slice(backupMaxSize))
      .then(files => {
        if (files.length) {
          return Promise.all(
            files.map(file => fs.removeAsync(`${absBackupFilePath}/${file}`))
          );
        }
      });
  },

  /**
   * 获取当前的备份文件夹
   */
  getCurrentBackupDir: function (absFilePath) {
    const { dir, base } = path.parse(absFilePath);
    return `${dir}/${backupDir}/${base}`;
  },

  /**
   * 根据timestamp获取备份文件
   */
  getBackupFile: function (absFilePath, timestamp) {
    const currentBackupDir = this.getCurrentBackupDir(absFilePath);
    return `${currentBackupDir}/${timestamp}.bak`;
  }

};