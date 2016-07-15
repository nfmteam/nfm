'use strict';

const Router = require('koa-router');
const apiParser = require('../lib/apiParser');

const apiListController = require('../controllers/api/list');
const apiFsController = require('../controllers/api/fs');
const apiUploadController = require('../controllers/api/upload');
const apiDownloadController = require('../controllers/api/download');

const router = new Router({
    prefix: '/api'
});

// api v1
router.use('*', apiParser);

router.get('/list', apiListController);

router.post('/fs', apiFsController.mkdir);
router.put('/fs', apiFsController.move);
router.delete('/fs', apiFsController.del);

router.post('/upload', apiUploadController);

router.get('/download', apiDownloadController);

module.exports = router;