'use strict';

const fsHelper = require('../../../utils/fsHelper');
const uploader = require('../../../utils/uploader');

module.exports = function *() {
    const { path } = this.params;
    var uploadDir, formData, files, paths = [];

    if (!path) {
        throw Error('入参错误');
    }

    if (!fsHelper.exists(path)) {
        throw Error('路径不存在');
    }

    uploadDir = fsHelper.resolveAbsolutePath(path);

    // 错误处理
    formData = yield uploader(this)
        .catch(error => {
            throw error;
        });

    files = formData.files.files;

    if (!files) {
        throw Error('files字段为空');
    }

    if (Object.prototype.toString.call(files) !== '[object Array]') {
        files = [files];
    }

    // 移动文件到path
    for (let file of files) {
        paths.push(`${uploadDir}/${file.name}`);
        yield fsHelper.fs.moveAsync(file.path, `${uploadDir}/${file.name}`)
    }

    // 返回上传的文件列表
    this.body = paths.map(p => fsHelper.getFileStat(p));
};