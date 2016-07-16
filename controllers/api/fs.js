'use strict';

const fsHelper = require('../../utils/fsHelper');
const fs = require('../../service/fs');
const path = require('path');

module.exports = {

    /**
     * 创建文件夹
     */
    mkdir: function *() {
        const { dir } = this.request.body;

        if (!dir) {
            throw Error('入参错误');
        }

        var absDir = fsHelper.resolveAbsolutePath(dir);
        var { dir: absPath, base: dirName } = path.parse(absDir);
        if (!fsHelper.testName(dirName)) {
            throw Error('文件名不合法');
        }

        var stat = yield fsHelper.exists(absPath);
        if (!stat) {
            throw Error('路径不存在');
        }

        var absDirStat = yield fsHelper.exists(absDir);
        if (absDirStat && absDirStat.isFile()) {
            throw Error('路径已存在');
        }

        yield fs.mkdir(absDir);
    },

    /**
     * 移动文件（夹）
     */
    move: function *() {
        var name, absSrc, absDest, srcStat, destStat,
            absNewSrc, newSrcStat;
        const { src, dest } = this.request.body;

        if (!src || !dest || src === dest) {
            throw Error('入参错误');
        }

        name = path.parse(src).base;

        absSrc = fsHelper.resolveAbsolutePath(src);
        absDest = fsHelper.resolveAbsolutePath(dest);

        srcStat = yield fsHelper.exists(absSrc);
        destStat = yield fsHelper.exists(absDest);

        if (!srcStat || !destStat) {
            throw Error('路径不存在');
        }

        if (destStat.isFile()) {
            throw Error('目标路径必须是目录');
        }

        absNewSrc = `${absDest}/${name}`;
        newSrcStat = yield fsHelper.exists(absNewSrc);

        if (newSrcStat) {
            throw Error('目标路径已存在');
        }

        yield fs.move(absSrc, `${absDest}/${name}`);
    },

    /**
     * 重命名文件（夹）
     */
    rename: function *() {
        var absSrc, stat;
        const { src, name } = this.request.body;

        if (!src || !name) {
            throw Error('入参错误');
        }

        if (!fsHelper.testName(name)) {
            throw Error('文件名不合法');
        }

        absSrc = fsHelper.resolveAbsolutePath(src);
        stat = yield fsHelper.exists(absSrc);

        if (!stat) {
            throw Error('路径不存在');
        }

        yield fs.rename(absSrc, name);
    },

    /**
     * 删除文件(夹)
     */
    del: function *() {
        var absPath, stat;
        const { path } = this.request.body;

        if (!path) {
            throw Error('入参错误');
        }

        if (path === '/') {
            throw Error('根目录不能删除');
        }

        absPath = fsHelper.resolveAbsolutePath(path);
        stat = yield fsHelper.exists(absPath);

        if (!stat) {
            throw Error('路径不存在');
        }

        yield fs.del(absPath);
    }

};