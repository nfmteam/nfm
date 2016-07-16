'use strict';

const fsHelper = require('../../utils/fsHelper');
const uploader = require('../../service/uploader');
const config = require('../../config');

const deployDir = config['deploy.dir'];

module.exports = function *() {
    var path, uploadDir, pathStat, formData,
        files, filePath, fileStat, paths = [];

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
        if (!fsHelper.testName(file.name)) {
            throw Error(`无效文件名:"${file.name}"`);
        }
    });

    // 移动文件到path
    for (let file of files) {
        filePath = `${uploadDir}/${file.name}`;

        // 文件不存在,直接上传; 已存在, 待发布
        fileStat = yield fsHelper.exists(filePath);
        if (fileStat) {
            yield fsHelper.fsExtra.moveAsync(file.path, `${uploadDir}/${deployDir}/${file.name}`, {
                clobber: true
            });
        } else {
            paths.push(filePath);
            yield fsHelper.fsExtra.moveAsync(file.path, filePath);
        }
    }
};