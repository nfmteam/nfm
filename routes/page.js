'use strict';

const router = require('koa-router')();

const indexController = require('../controllers/index');

// pages
router.get('*', indexController.index);

module.exports = router;