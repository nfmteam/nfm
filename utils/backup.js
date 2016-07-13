'use strict';

const fsHelper = require('./fsHelper');
const path = require('path');
const config = require('../lib/config');

const backupDir = config['backup.dir'];

module.exports = {

    add: function (file) {
        var { dir, base } = path.parse(file),
            destPath = `${dir}/${backupDir}/${base}.${Date.now()}.bak`;

        return fsHelper.fs.copyAsync(file, destPath);
    },

    getBackupList: function (file) {
        var { dir, base } = path.parse(file),
            backupPath = `${dir}/${backupDir}`,
            regexp = `\\.${base.replace('.', '\\.')}\\.\\d+\\.bak$`;

        return fsHelper.fs.walkAsync(backupPath)
            .then(result => {
                return result
                    .filter(filePath => new RegExp(regexp).test(filePath));
            });
    },

    // 恢复到待发布模式
    restore: function () {

    },

    clean: function (p) {

    }

};