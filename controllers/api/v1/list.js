'use strict';

const fsHelper = require('../../../utils/fsHelper');

module.exports = function *() {
    const p = this.request.query.path || '/';
    const _type = this.request.query.type;
    const stat = fsHelper.exists(p);

    if (!stat || !stat.isDirectory()) {
        throw Error('路径不存在');
    }

    let type = ['f', 'd'];

    if (_type === 'f' || _type === 'd') {
        type = [_type];
    }

    this.body = fsHelper.getFileList(p, type);
};