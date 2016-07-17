'use strict';

const fsHelper = require('../../utils/fsHelper');
const deployer = require('../../service/deployer');

module.exports = {

  deploy: function *() {
    var absFilePath, fileStat,
      absDeployFilePath, deployFileStat;

    const { path } = this.request.body;

    if (!path) {
      throw Error('入参错误');
    }

    absFilePath = fsHelper.resolveAbsolutePath(path);
    fileStat = yield fsHelper.exists(absFilePath);

    if (!fileStat || !fileStat.isFile()) {
      throw Error('文件不存在');
    }

    absDeployFilePath = deployer.getDeployFilePath(absFilePath);
    deployFileStat = yield fsHelper.deployFileExists(absDeployFilePath);

    if (!deployFileStat || !deployFileStat.isFile()) {
      throw Error('待发布文件不存在');
    }

    yield deployer.deploy(absFilePath, absDeployFilePath);
  },

  undeploy: function *() {
    var absFilePath, absDeployFilePath, deployFileStat;

    const { path } = this.request.body;

    if (!path) {
      throw Error('入参错误');
    }

    absFilePath = fsHelper.resolveAbsolutePath(path);
    absDeployFilePath = deployer.getDeployFilePath(absFilePath);
    deployFileStat = yield fsHelper.deployFileExists(absDeployFilePath);

    if (deployFileStat && deployFileStat.isFile()) {
      yield deployer.undeploy(absDeployFilePath);
    }
  }

};