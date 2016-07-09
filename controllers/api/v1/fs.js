'use strict';

const fsHelper = require('../../../utils/fsHelper');
const parse = require('co-body');

module.exports = {

    /**
     * 创建文件夹
     */
    mkdir: function* () {
        const { dir } = this.request.body;

        if (!dir) {
            throw Error('入参错误');
        }

        if (!fsHelper.testName(dir)) {
            throw Error('文件名不合法');
        }

        yield fsHelper.mkdir(dir)
            .catch(error => {
                if (error.code === 'EEXIST') {
                    throw Error('目录已存在');
                }

                throw error;
            });
    },

    /**
     * 移动文件（夹）
     */
    move: function* () {
        const { src, dest } = this.request.body;

        if (!src || !dest) {
            throw Error('入参错误');
        }

        if (!fsHelper.exists(src) || !fsHelper.exists(dest)) {
            throw Error('路径不存在');
        }

        var name = src.slice(src.lastIndexOf('/'));

        if(!fsHelper.testName(name)) {
            throw Error('文件名不合法');
        }

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

        if(!fsHelper.testName(name)) {
            throw Error('文件名不合法');
        }

        yield fsHelper.rename(src, name);
    }

};