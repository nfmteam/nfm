'use strict';

const fsHelper = require('../../utils/fsHelper');
const backup = require('../../service/backup');

module.exports = {

  /**
   * 获取历史记录列表
   */
  list: function *() {
    const path = this.request.query.path;

    var absFilePath, fileStat, absBackupDir, backupStat, list;

    if (!path) {
      throw Error('入参错误');
    }

    absFilePath = fsHelper.resolveAbsolutePath(path);
    fileStat = yield fsHelper.exists(absFilePath);

    if (!fileStat || !fileStat.isFile()) {
      throw Error('文件不存在');
    }

    absBackupDir = backup.getCurrentBackupDir(absFilePath);
    backupStat = yield fsHelper.backupExists(absBackupDir);

    if (backupStat) {
      list = yield backup.getBackupFileList(absBackupDir);
    } else {
      list = [];
    }

    this.body = list;
  },

  /**
   * 恢复到某一历史
   */
  restore: function *() {
    const { path, timestamp } = this.request.body;

    if (!path || !timestamp) {
      throw Error('入参错误');
    }

    var absFilePath, fileStat, absBackupFile, backupFileStat;

    absFilePath = fsHelper.resolveAbsolutePath(path);
    fileStat = yield fsHelper.exists(absFilePath);

    if (!fileStat || !fileStat.isFile()) {
      throw Error('文件不存在');
    }

    absBackupFile = backup.getBackupFile(absFilePath, timestamp);
    backupFileStat = yield fsHelper.backupExists(absBackupFile);

    if (!backupFileStat) {
      throw Error('历史备份不存在');
    }

    yield backup.restore(absFilePath, absBackupFile);
  }

};