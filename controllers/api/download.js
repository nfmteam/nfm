'use strict';

const fsHelper = require('../../utils/fsHelper');

module.exports = function *() {
  var absFilePath, stat;
  const p = this.request.query.path;

  if (!p) {
    throw Error('入参错误');
  }

  absFilePath = fsHelper.resolveAbsolutePath(p);
  stat = yield fsHelper.exists(absFilePath);

  if (!stat || !stat.isFile()) {
    throw Error('文件不存在');
  }

  this.attachment(absFilePath);
};