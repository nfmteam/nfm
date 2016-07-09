'use strict';

const path = require('path');
const fsHelper = require('../../../utils/fsHelper');

module.exports = {

    // path校验(排除隐藏文件...)
    getList: function *() {
        const p = this.request.query.path || '/';
        const _type = this.request.query.type;

        const dir = fsHelper.resolvePath(p);

        let type = ['f', 'd'];

        if (_type === 'f' || _type === 'd') {
            type = [_type];
        }

        this.body = fsHelper.getFileList(dir, type);
    }

};