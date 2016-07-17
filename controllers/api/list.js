'use strict';

const fsHelper = require('../../utils/fsHelper');
const fs = require('../../service/fs');

module.exports = function *() {
  var absPath, stat;
  const p = this.request.query.path || '/';
  const _type = this.request.query.type;

  absPath = fsHelper.resolveAbsolutePath(p);
  stat = yield fsHelper.exists(absPath);

  if (!stat || !stat.isDirectory()) {
    throw Error('目录不存在');
  }

  let type = ['f', 'd'];

  if (_type === 'f' || _type === 'd') {
    type = [_type];
  }

  this.body = yield fs.getFileList(absPath, type);
};