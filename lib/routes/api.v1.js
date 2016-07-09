'use strict';

const Router = require('koa-router');
const logger = require('../logger');

const apiV1ListController = require('../../controllers/api/v1/list');
const apiV1FsController = require('../../controllers/api/v1/fs');

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
router.post('/fs', apiV1FsController.mkdir);
router.put('/fs', apiV1FsController.move);

module.exports = router;