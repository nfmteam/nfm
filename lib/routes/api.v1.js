'use strict';

const Router = require('koa-router');
const apiParser = require('../apiParser');

const apiV1ListController = require('../../controllers/api/v1/list');
const apiV1FsController = require('../../controllers/api/v1/fs');
const apiV1UploadController = require('../../controllers/api/v1/upload');
const apiV1DownloadController = require('../../controllers/api/v1/download');

const router = new Router({
    prefix: '/api/v1'
});

// api v1
router.use('*', apiParser);

router.get('/list', apiV1ListController.getList);

router.post('/fs', apiV1FsController.mkdir);
router.put('/fs', apiV1FsController.move);
router.delete('/fs', apiV1FsController.del);

router.post('/upload', apiV1UploadController);

router.get('/download', apiV1DownloadController);

module.exports = router;