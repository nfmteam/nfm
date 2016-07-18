'use strict';

const path = require('path');
const fs = require('../utils/fsHelper').fsExtra;
const backup = require('./backup');

const config = require('../config');
const deployDir = config['deploy.dir'];

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
   * 发布
   */
  deploy: function (absFilePath, absDeployFilePath) {
    return fs.moveAsync(absDeployFilePath, absFilePath, clobberOptions)
      .then(() => backup.add(absFilePath))
  },

  /**
   * 获取待发布文件列表
   */
  getDeployFiles: function (absPath) {
    // ...
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
  }

};