'use strict';

const mime = require('mime-types');
const fsHelper = require('../../utils/fsHelper');
const uploader = require('../../service/uploader');
const deployer = require('../../service/deployer');

module.exports = function *() {
  var path, uploadDir, pathStat, formData, files, zipNum = 0;

  formData = yield uploader(this);

  path = formData.fields.path;
  files = formData.files.files;

  if (!path) {
    throw Error('入参错误');
  }

  uploadDir = fsHelper.resolveAbsolutePath(path);
  pathStat = yield fsHelper.exists(uploadDir);

  if (!pathStat) {
    throw Error('路径不存在');
  }

  if (!pathStat.isDirectory()) {
    throw Error('路径必须是目录');
  }

  if (!files) {
    throw Error('files字段为空');
  }

  if (Object.prototype.toString.call(files) !== '[object Array]') {
    files = [files];
  }

  files.forEach(file => {
    if (mime.extension(file.type) === 'zip') {
      zipNum++;
    } else if (!fsHelper.testName(file.name)) {
      throw Error(`无效文件名:"${file.name}"`);
    }
  });

  if (!(zipNum === 0 || (zipNum === 1 && zipNum === files.length))) {
    throw Error('只允许上传一个zip文件');
  }

  // 移动文件到path
  for (let file of files) {
    // 不管文件是否存在, 都进入待发布模式
    yield deployer.add(file.path, `${uploadDir}/${file.name}`);
  }
};