'use strict';

const path = require('path');

module.exports = {

  // -------------- app configuration --------------

  // 端口号
  'app.port': 3010,

  // -------------- fs configuration ---------------

  'fs.base': '/Users/keenwon/Desktop/temp',

  // -------------- upload configuration -----------

  'upload.dir': '.nfm_upload',

  'upload.multiples': true,

  'upload.keepTime': 24 * 60 * 60 * 1000,

  // -------------- backup configuration -----------

  'backup.dir': '.nfm_backup',

  'backup.maxSize': 10,

  // -------------- deploy configuration -----------

  'deploy.dir': '.nfm_deploy',

  'deploy.keepTime': 24 * 60 * 60 * 1000,

  // -------------- robot configuration ------------

  'robot.cron': '* 21 * * * *',

  // -------------- log configuration --------------

  // 启用日志
  'log.enable': true,

  // 启用全局日志
  'log.global.enable': true,

  // 日志文件夹路径
  'log.path': path.join(__dirname, 'logs'),

  // 单个日志文件大小
  'log.maxsize': 1024 * 1024 * 100
};