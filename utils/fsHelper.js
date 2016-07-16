'use strict';

const Promise = require('bluebird');
const fsExtra = require('fs-extra');
const fs = Promise.promisifyAll(fsExtra);

const path = require('path');
const moment = require('moment');
const filesize = require('filesize');
const crypto = require('crypto');

const config = require('../config');
const basePath = config['fs.base'];
const uploadDir = config['upload.dir'];
const backupDir = config['backup.dir'];
const deployDir = config['deploy.dir'];

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

function normalizeDate(data) {
    return moment(data).format('YY-MM-DD HH:mm:ss');
}

module.exports = {

    fsExtra: fs,

    /**
     * 获取文件信息
     */
    info: function (absFilePath) {
        return this.stat(absFilePath)
            .then(stat => ({
                id: md5(absFilePath),
                name: path.basename(absFilePath),
                extname: path.extname(absFilePath),
                path: this.resolveRelativePath(absFilePath),
                size: filesize(stat.size),
                createAt: normalizeDate(stat.birthtime),
                updateAt: normalizeDate(stat.mtime),
                type: stat.isDirectory() ? 'd' : 'f'
            }));
    },

    /**
     * 将path(绝对路径)解析为基于base路径的相对地址
     */
    resolveRelativePath: (p = '/') => path.normalize('/' + path.relative(basePath, p)),

    /**
     * 将path解析为基于base路径的绝对地址
     */
    resolveAbsolutePath: (p = '/') => {
        // 防止"../../../file"跳的basePath之外
        var safaPath = path.resolve('/', path.normalize(p));
        return path.normalize(path.join(basePath, safaPath));
    },

    /**
     * 判断path是否存在
     */
    exists: function (absPath) {
        // 隐藏备份, 上传, 发布文件夹
        if (!absPath || absPath.includes(uploadDir)
            || absPath.includes(backupDir) || absPath.includes(deployDir)) {
            return Promise.resolve(false);
        }

        return this.stat(absPath)
            .then(stat => stat)
            .catchReturn(false);
    },

    stat: absFilePath => fs.statAsync(absFilePath),

    /**
     * 测试文件（夹）名合法性
     */
    testName: function (name) {
        if (name === backupDir || name === deployDir || name === uploadDir) {
            return false;
        }

        return /^[\w\-\.]*$/.test(name);
    }

};