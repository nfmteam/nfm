'use strict';

const Router = require('koa-router');
const logger = require('../logger');

const apiV1ListController = require('../../controllers/api/v1/list');
const apiV1DirController = require('../../controllers/api/v1/dir');

const router = new Router({
    prefix: '/api/v1'
});

const defaultResponse = {
    code: 200,
    message: '',
    data: {}
};

const apiSuccess = (data = {}) =>Object.assign({}, defaultResponse, {
    data: data
});

const apiError = (message = 'error') => Object.assign({}, defaultResponse, {
    code: 500,
    message: message
});

function *responseFormat(next) {
    try {
        yield next;
        this.body = apiSuccess(this.body);
    } catch (error) {
        logger.error(error);

        this.status = 200;
        this.body = apiError(error.message);
    }
}

// api v1
router.use('*', responseFormat);
router.get('/list', apiV1ListController.getList);
router.post('/dir', apiV1DirController.mkdir);
router.put('/dir', apiV1DirController.move);

module.exports = router;