'use strict';

const fsHelper = require('../../../utils/fsHelper');
const parse = require('co-body');

module.exports = {

    mkdir: function *() {
        const { dir } = this.request.body;

        if (!dir) {
            throw Error('入参错误');
        }

        yield fsHelper.mkdir(dir)
            .catch(error => {
                throw error;
            });
    },

    move: function *(src, dest) {

    }

};