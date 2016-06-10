'use strict';

const router = require('koa-router')();
const config = require('./config');

const indexController = require('../controllers/index');

router.get('/', indexController.index);
router.get('/getList', indexController.getList);

module.exports = router;