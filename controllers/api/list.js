'use strict';

const fs = require('../../service/fs');

module.exports = function *() {
    const p = this.request.query.path || '/';
    const _type = this.request.query.type;

    const stat = fs.exists(p);
    if (!stat || !stat.isDirectory()) {
        throw Error('路径不存在');
    }

    let type = ['f', 'd'];

    if (_type === 'f' || _type === 'd') {
        type = [_type];
    }

    this.body = fs.getFileList(p, type);
};