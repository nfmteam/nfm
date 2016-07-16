'use strict';

const path = require('path');
const fsHelper = require('../utils/fsHelper');
const backup = require('./backup');

const config = require('../config');
const deployDir = config['deploy.dir'];

module.exports = {

    add: function (absUploadFilePath, absFilePath) {
        const absDeployFilePath = this.getDeployFilePath(absFilePath);

        return fsHelper.fsExtra
            .moveAsync(absUploadFilePath, absDeployFilePath, {
                clobber: true
            });
    },

    deploy: function (absFilePath, absDeployFilePath) {
        return fsHelper.fsExtra
            .moveAsync(absDeployFilePath, absFilePath, {
                clobber: true
            })
            .then(() => backup.add(absFilePath));
    },

    undeploy: function (absFilePath, absDeployFilePath) {
        return fsHelper.fsExtra
            .removeAsync(absDeployFilePath);
    },

    getDeployFilePath: function (absFilePath) {
        const { dir, base } = path.parse(absFilePath);
        return `${dir}/${deployDir}/${base}`;
    }
};