'use strict';

const fs = require('../../service/fs');

module.exports = function *() {
    const p = this.request.query.path;

    if (!p) {
        throw Error('入参错误');
    }

    var stat = fs.exists(p);

    if (!stat || !stat.isFile()) {
        throw Error('文件不存在');
    }

    var file = fs.resolveAbsolutePath(p);

    this.attachment(file);
};