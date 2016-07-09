'use strict';

const parse = require('co-body');

module.exports = bodyParse;

function *bodyParse(next) {
    this.request.body = yield parse(this).catch(() => ({}));

    yield next;
}