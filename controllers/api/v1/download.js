'use strict';

const fsHelper = require('../../../utils/fsHelper');

module.exports = function *() {
    const p = this.request.query.path;

    if (!p) {
        throw Error('入参错误');
    }

    if (!fsHelper.exists(p)) {
        throw Error('文件不存在');
    }

    var file = fsHelper.resolveAbsolutePath(p);

    if (!fsHelper.fs.statSync(file).isFile()) {
        throw Error('文件不存在');
    }

    this.attachment(file);
};