'use strict';

const router = require('koa-router')();
const config = require('./config');

const indexController = require('../controllers/index');

const apiV1ListController = require('../controllers/api/v1/list');

// api v1
router.get('/api/v1/list', apiV1ListController.getList);

// pages
router.get('*', indexController.index);

module.exports = router;