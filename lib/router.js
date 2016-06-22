'use strict';

const router = require('koa-router')();
const config = require('./config');

const indexController = require('../controllers/index');

const apiV1ListController = require('../controllers/api/v1/list');

// pages
router.get('/', indexController.index);

// api v1
router.get('/api/v1/list', apiV1ListController.getList);

module.exports = router;