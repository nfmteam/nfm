'use strict';

const path = require('path');
const mime = require('mime-types');
const fsHelper = require('../../../utils/fsHelper');

module.exports = function *(next) {
    const p = this.request.query.path;

    if (!p) {
        throw Error('入参错误');
    }

    if (!fsHelper.exists(p)) {
        throw Error('文件不存在');
    }

    var file = fsHelper.resolveAbsolutePath(p);
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    this.response.set('Content-disposition', 'attachment; filename=' + filename);
    this.response.set('Content-type', mimetype);

    yield fsHelper.fs.createReadStreamAsync(file).pipe(this.response);

    yield next;
};