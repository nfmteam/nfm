'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const basePath = process.cwd();

module.exports = {

    // TODO: path校验(排除隐藏文件...)
    getList: function *() {
        const p = this.request.query.path || '/';
        const type = this.request.query.type || 'f';
        const dir = path.join(basePath, path.resolve('/', p));

        this.body = getFileList(dir, type);
    }

};

function getFileList(dir, type) {
    return fs.readdirSync(dir)
        .filter(filename => !!filename.indexOf('.'))
        .map(filename => getFileStat(path.resolve(dir, filename)))
        .filter(obj => obj.type === type);
}

function getFileStat(filePath) {
    var stats = fs.statSync(filePath);

    return {
        id: md5(filePath), // TODO: 临时方案
        name: path.basename(filePath),
        size: stats.size,
        createAt: stats.birthtime,
        updateAt: stats.mtime,
        type: getFileType(stats.mode)
    }
}

function getFileType(mode) {
    switch (mode & 0o170000) {
        case 0o100000:
            return 'f';
        case 0o040000:
            return 'd';
        default:
            return '-';
    }
}

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}