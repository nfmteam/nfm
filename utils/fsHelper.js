'use strict';

const fs = require('../lib/fs');
const config = require('../lib/config');
const path = require('path');
const moment = require('moment');
const filesize = require('filesize');
const crypto = require('crypto');

const basePath = config['fs.base'];

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
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

module.exports = {

    fs: fs,

    /**
     * 获取文件(夹)列表
     */
    getFileList: function (dir, types) {
        var p = this.resolveAbsolutePath(dir);

        return fs.readdirSync(p)
            .map(filename => this.getFileStat(path.resolve(p, filename)))
            .filter(obj => types.includes(obj.type));
    },

    /**
     * 获取文件信息
     */
    getFileStat: function (filePath) {
        const stats = fs.statSync(filePath);

        return {
            id: md5(filePath), // TODO: 临时方案
            name: path.basename(filePath),
            extname: path.extname(filePath),
            path: this.resolveRelativePath(filePath),
            size: filesize(stats.size),
            createAt: moment(stats.birthtime).format('YY-MM-DD HH:mm:ss'),
            updateAt: moment(stats.mtime).format('YY-MM-DD HH:mm:ss'),
            type: getFileType(stats.mode)
        }
    },

    /**
     * 将path(绝对路径)解析为基于base路径的相对地址
     */
    resolveRelativePath: function (p) {
        return p ? '/' + path.relative(basePath, p) : '';
    },

    /**
     * 将path解析为基于base路径的绝对地址
     */
    resolveAbsolutePath: function (p) {
        // 防止../../../file跳的basePath之外
        var safaPath = path.resolve('/', p);
        return p ? path.join(basePath, safaPath) : '';
    },

    /**
     * 判断path是否存在
     */
    exists: function (p) {
        var result = false;

        if (!p) {
            return result;
        }

        try {
            fs.statSync(this.resolveAbsolutePath(p));
            result = true;
        } catch (error) {
        }

        return result;
    },

    /**
     * 测试文件（夹）名合法性
     */
    testName: function (name) {
        return /^[\w\-\.]*$/.test(name);
    },

    /**
     * 创建文件夹
     */
    mkdir: function (dir) {
        return fs.mkdirAsync(this.resolveAbsolutePath(dir));
    },

    /**
     * 移动文件(夹)
     */
    move: function (src, dest) {
        src = this.resolveAbsolutePath(src);
        dest = this.resolveAbsolutePath(dest);

        return fs.moveAsync(src, dest);
    },

    /**
     * 重命名文件（夹）
     */
    rename: function (src, name) {
        src = this.resolveAbsolutePath(src);

        var newSrc = src.replace(/[^\/]+$/, name);

        return fs.moveAsync(src, newSrc);
    },

    /**
     * 删除文件(夹)
     */
    del: function (p) {
        var absPath = this.resolveAbsolutePath(p);

        if (fs.statSync(absPath).isDirectory()) {
            return fs.rmdirAsync(absPath);
        }

        return fs.unlinkAsync(absPath);
    }

};