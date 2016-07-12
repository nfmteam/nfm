'use strict';

const fsHelper = require('../../../utils/fsHelper');
const uploader = require('../../../utils/uploader');

module.exports = function *() {
    var path, uploadDir, formData, files, paths = [];

    formData = yield uploader(this);

    path = formData.fields.path;
    files = formData.files.files;

    if (!path) {
        throw Error('入参错误');
    }

    if (!fsHelper.exists(path)) {
        throw Error('路径不存在');
    }

    uploadDir = fsHelper.resolveAbsolutePath(path);

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
        paths.push(`${uploadDir}/${file.name}`);

        // 重复则覆盖文件
        yield fsHelper.fs.moveAsync(file.path, `${uploadDir}/${file.name}`, { clobber: true });
    }

    // 返回上传的文件列表
    this.body = paths.map(p => fsHelper.getFileStat(p));
};