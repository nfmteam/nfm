'use strict';

const Router = require('koa-router');
const apiParser = require('../apiParser');

const apiV1ListController = require('../../controllers/api/v1/list');
const apiV1FsController = require('../../controllers/api/v1/fs');

const router = new Router({
    prefix: '/api/v1'
});

// api v1
router.use('*', apiParser);
router.get('/list', apiV1ListController.getList);
router.post('/fs', apiV1FsController.mkdir);
router.put('/fs', apiV1FsController.move);

module.exports = router;