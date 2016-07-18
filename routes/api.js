'use strict';

const Router = require('koa-router');
const apiParser = require('../lib/apiParser');

const apiListController = require('../controllers/api/list');
const apiFsController = require('../controllers/api/fs');
const apiUploadController = require('../controllers/api/upload');
const apiDownloadController = require('../controllers/api/download');
const apiDeployController = require('../controllers/api/deploy');
const apiHistoryController = require('../controllers/api/history');

const router = new Router({
  prefix: '/api'
});

// parser
router.use('*', apiParser);

// list
router.get('/list', apiListController);

// fs mkdir
router.post('/fs/mkdir', apiFsController.mkdir);

// fs move
router.put('/fs/move', apiFsController.move);

// fs rename
router.put('/fs/rename', apiFsController.rename);

// fs delete
router.delete('/fs/delete', apiFsController.del);

// file upload
router.post('/upload', apiUploadController);

// file download
router.get('/download', apiDownloadController);

// depoly
router.post('/deploy', apiDeployController.deploy);

// undepoly
router.delete('/undeploy', apiDeployController.undeploy);

// history list
router.get('/history/list', apiHistoryController.list);

// history restory
router.post('/history/restore', apiHistoryController.restore);


module.exports = router;