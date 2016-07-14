'use strict';

const fsHelper = require('../../../utils/fsHelper');
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

        var parsedDir = path.parse(dir),
            p = parsedDir.dir,
            dirName = parsedDir.base;

        if (!fsHelper.exists(p)) {
            throw Error('路径不存在');
        }

        if (!fsHelper.testName(dirName)) {
            throw Error('文件名不合法');
        }

        yield fsHelper.mkdir(dir);
    },

    /**
     * 移动文件（夹）
     */
    move: function *() {
        const { src, dest } = this.request.body;

        if (!src || !dest) {
            throw Error('入参错误');
        }

        if (!fsHelper.exists(src) || !fsHelper.exists(dest)) {
            throw Error('路径不存在');
        }

        var name = path.parse(src).base;
        var newSrc = `${dest}/${name}`;

        yield fsHelper.move(src, newSrc);
    },

    /**
     * 重命名文件（夹）
     */
    rename: function *() {
        const { src, name } = this.request.body;

        if (!src || !name) {
            throw Error('入参错误');
        }

        if (!fsHelper.exists(src)) {
            throw Error('路径不存在');
        }

        if (!fsHelper.testName(name)) {
            throw Error('文件名不合法');
        }

        yield fsHelper.rename(src, name)
            .catch(error => {
                if (error.code === 'EEXIST') {
                    throw Error(`${name}已存在`);
                }

                throw error;
            });
    },

    /**
     * 删除文件(夹)
     */
    del: function *() {
        const { path } = this.request.body;

        if (!path) {
            throw Error('入参错误');
        }

        if (path === '/') {
            throw Error('根目录不能删除');
        }

        if (!fsHelper.exists(path)) {
            throw Error('路径不存在');
        }

        yield fsHelper.del(path);
    }

};