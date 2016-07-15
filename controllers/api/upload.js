'use strict';

const fs = require('../../service/fs');
const uploader = require('../../service/uploader');
const config = require('../../config');

const deployDir = config['deploy.dir'];

module.exports = function *() {
    var path, uploadDir, formData, files, filePath, paths = [];

    formData = yield uploader(this);

    path = formData.fields.path;
    files = formData.files.files;

    if (!path) {
        throw Error('入参错误');
    }

    if (!fs.exists(path)) {
        throw Error('路径不存在');
    }

    uploadDir = fs.resolveAbsolutePath(path);

    if (!files) {
        throw Error('files字段为空');
    }

    if (Object.prototype.toString.call(files) !== '[object Array]') {
        files = [files];
    }

    files.forEach(file => {
        if (!fs.testName(file.name)) {
            throw Error(`无效文件名:"${file.name}"`);
        }
    });

    // 移动文件到path
    for (let file of files) {
        filePath = `${uploadDir}/${file.name}`;

        // 文件不存在,直接上传; 已存在, 待发布
        if (fs.absPathExists(filePath)) {
            yield fs.fsExtra.moveAsync(file.path, `${uploadDir}/${deployDir}/${file.name}`, {
                clobber: true
            });
        } else {
            paths.push(filePath);
            yield fs.fsExtra.moveAsync(file.path, filePath);
        }
    }

    // 返回上传的文件列表
    this.body = paths.map(p => fs.getFileStat(p));
};