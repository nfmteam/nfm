'use strict';

const path = require('path');
const moment = require('moment');
const fsHelper = require('../utils/fsHelper');
const fs = fsHelper.fsExtra;
const backup = require('./backup');

const config = require('../config');
const deployDir = config['deploy.dir'];
const deployKeeptime = config['deploy.keepTime'];

const clobberOptions = {
  clobber: true
};

module.exports = {

  /**
   * 添加发布文件
   */
  add: function (absUploadFilePath, absFilePath) {
    const absDeployFilePath = this.getDeployFilePath(absFilePath);
    const currentDeployDir = this.getCurrentDeployDir(absFilePath);

    return fs.ensureDirAsync(currentDeployDir)
      .then(() => fs.moveAsync(absUploadFilePath, absDeployFilePath, clobberOptions));
  },

  /**
   * 按目录添加发布文件
   */
  addByDir: function (absUploadDir, dir) {
    return this.walk(absUploadDir)
      .then(items => {
        items.forEach(item => {
          let fileName = path.parse(item).base;
          if (!fsHelper.testName(fileName)) {
            throw Error(`zip包存在无效文件名:"${fileName}"`);
          }
        });

        return items;
      })
      .then(items => items.map(item => {
        let _path = path.relative(absUploadDir, item);
        let absFilePath = path.join(dir, _path);

        return this.add(item, absFilePath)
      }))
      .then(promises => Promise.all(promises));
  },

  walk: function (absDir) {
    return new Promise(function (resolve, reject) {
      let items = [];

      fs.walk(absDir)
        .on('error', error => {
          reject(error);
        })
        .on('data', item => {
          if (item.stats.isDirectory()) {
            return;
          }
          items.push(item.path);
        })
        .on('end', () => {
          resolve(items);
        });
    });
  },

  /**
   * 发布
   */
  deploy: function (absFilePath, absDeployFilePath) {
    return fs.moveAsync(absDeployFilePath, absFilePath, clobberOptions)
      .then(() => backup.add(absFilePath))
  },

  /**
   * 获取待发布文件列表
   */
  getDeployFiles: function (absDir) {
    return fs.readdirAsync(`${absDir}/${deployDir}`);
  },

  /**
   * 取消发布
   */
  undeploy: function (absDeployFilePath) {
    return fs.removeAsync(absDeployFilePath);
  },

  /**
   * 根据文件获取对应的发布文件
   */
  getDeployFilePath: function (absFilePath) {
    const { dir, base } = path.parse(absFilePath);
    return `${dir}/${deployDir}/${base}`;
  },

  /**
   * 根据文件获取当前的发布目录
   */
  getCurrentDeployDir: function (absFilePath) {
    const { dir } = path.parse(absFilePath);
    return `${dir}/${deployDir}`;
  },

  /**
   * 清理待发布文件(留存时间大于deployKeeptime的)
   */
  clean: function (absPath) {
    var absDeployDir = `${absPath}/${deployDir}`;

    return fs.readdirAsync(absDeployDir)
      .catchReturn(Promise.resolve([]))
      .then(files => files.map(file => ({
        path: file,
        stat: fs.statSync(`${absDeployDir}/${file}`)
      })))
      .then(files => files.forEach(file => {
        if (moment() - moment(file.stat.mtime) > deployKeeptime) {
          fs.removeSync(`${absDeployDir}/${file.path}`);
        }
      }));
  }

};