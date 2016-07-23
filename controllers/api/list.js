'use strict';

const fsHelper = require('../../utils/fsHelper');
const fs = require('../../service/fs');
const deployer = require('../../service/deployer');
const backup = require('../../service/backup');

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

  var [files, backups, deploys] = yield [
    fs.getFileList(absPath, type),
    backup.getBackupList(absPath).catchReturn([]),
    deployer.getDeployFiles(absPath).catchReturn([])
  ];

  files.map(file => {
    file.hasBackup = backups.includes(file.name);
    file.hasDeploy = deploys.includes(file.name);
    return file;
  });

  this.body = files;
};