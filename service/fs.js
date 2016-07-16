'use strict';

const Promise = require('bluebird');
const fsHelper = require('../utils/fsHelper');
const fs = fsHelper.fsExtra;
const path = require('path');

const config = require('../config');

const uploadDir = config['upload.dir'];
const backupDir = config['backup.dir'];
const deployDir = config['deploy.dir'];

module.exports = {

    /**
     * 获取文件(夹)列表
     */
    getFileList: function (absPath, types) {
        return fs.readdirAsync(absPath)
            .filter(fileName => ![uploadDir, backupDir, deployDir].includes(fileName))
            .then(fileNames => Promise.all(
                fileNames.map(fileName => fsHelper.info(`${absPath}/${fileName}`))
            ))
            .filter(fileName => types.includes(fileName.type));
    },

    /**
     * 创建文件夹
     */
    mkdir: function (absDir) {
        return Promise.all([
            fs.ensureDirAsync(`${absDir}/${backupDir}`),
            fs.ensureDirAsync(`${absDir}/${deployDir}`)
        ]);
    },

    /**
     * 移动文件(夹)
     */
    move: function (absSrc, absDest) {
        return this._move(absSrc, absDest);
    },

    /**
     * 重命名文件（夹）
     */
    rename: function (absSrc, name) {
        const absDest = absSrc.replace(/[^\/]+$/, name);

        return fsHelper.exists(absDest)
            .then(stat => {
                if (stat) {
                    throw Error(`${name}已存在`);
                }

                return this._move(absSrc, absDest);
            });
    },

    _moveBackupAndDeploy: function (absSrc, absDest) {
        var { dir: srcDir, base: srcBase } = path.parse(absSrc),
            { dir: destDir, base: destBase } = path.parse(absDest),
            deploySrc = `${srcDir}/${deployDir}/${srcBase}`,
            deployDest = `${destDir}/${deployDir}/${destBase}`,
            backupSrc = `${srcDir}/${backupDir}/${srcBase}`,
            backupDest = `${destDir}/${backupDir}/${destBase}`;

        return Promise.all([
            fs.moveAsync(deploySrc, deployDest).catchReturn(null),
            fs.moveAsync(backupSrc, backupDest).catchReturn(null)
        ]);
    },

    _move: function (absSrc, absDest) {
        return fsHelper.stat(absSrc)
            .call('isDirectory')
            .then(isDir => {
                if (isDir) {
                    return fs.moveAsync(absSrc, absDest);
                }

                // 同时静默移动待发布文件和备份文件夹
                return fs.moveAsync(absSrc, absDest)
                    .then(() => this._moveBackupAndDeploy(absSrc, absDest));
            });
    },

    /**
     * 删除文件(夹)
     */
    del: function (absPath) {
        return fsHelper.stat(absPath)
            .call('isDirectory')
            .then(isDir => {
                if (isDir) {
                    return fs.readdirAsync(absPath)
                        .filter(fileName => fileName !== backupDir && fileName !== deployDir)
                        .then(fileList => {
                            if (fileList.length > 0) {
                                throw new Error('目录非空');
                            }
                        })
                        .then(() => fs.removeAsync(absPath));
                }

                return fs.unlinkAsync(absPath)
                    .then(() => this._deleteBackupAndDeploy(absPath));
            });
    },

    _deleteBackupAndDeploy: function (absPath) {
        var { dir, base } = path.parse(absPath),
            absBackupDir = `${dir}/${backupDir}/${base}`,
            absDeployFile = `${dir}/${deployDir}/${base}`;

        return Promise.all([
            fs.removeAsync(absBackupDir).catchReturn(null),
            fs.removeAsync(absDeployFile).catchReturn(null)
        ]);
    }

};