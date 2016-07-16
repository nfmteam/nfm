'use strict';

const fs = require('../../service/fs');

module.exports = function *() {
    var absFilePath, stat;
    const p = this.request.query.path;

    if (!p) {
        throw Error('入参错误');
    }

    absFilePath = fs.resolveAbsolutePath(p);
    stat = yield fs.exists(absFilePath);

    if (!stat || !stat.isFile()) {
        throw Error('文件不存在');
    }

    this.attachment(absFilePath);
};