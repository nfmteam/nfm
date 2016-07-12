'use strict';

const fsHelper = require('../../../utils/fsHelper');

module.exports = function *() {
    const p = this.request.query.path;

    if (!p) {
        throw Error('入参错误');
    }

    var stat = fsHelper.exists(p);

    if (!stat || !stat.isFile()) {
        throw Error('文件不存在');
    }

    var file = fsHelper.resolveAbsolutePath(p);

    this.attachment(file);
};