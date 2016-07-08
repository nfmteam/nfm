'use strict';

// error
function *errorHandler(next) {
    try {
        yield next;
    } catch (error) {
        // 支持koa的this.throw抛出http-error
        if (error.status && error.status !== 500) {
            return this.throw(error);
        }

        this.app.emit('error', error, this);

        this.body = {
            code: error.status || 500,
            message: error.message
        };
    }
}

// 404
function *notfoundHandler(next) {
    yield next;

    let body = this.body,
        status = this.status || 404,
        noContent = ~[204, 205, 304].indexOf(status);

    // ignore
    if (noContent || body) {
        return;
    }

    this.body = {
        code: this.status,
        message: 'Not Found'
    };
}

module.exports = {
    errorHandler,
    notfoundHandler
};