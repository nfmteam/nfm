'use strict';

const schedule = require('node-schedule');
const logger = require('./lib/logger');
const robot = require('./service/robot');
const config = require('./config');
const cron = config['robot.cron'];

schedule.scheduleJob(cron, () => {
  logger.info('[Schedule]', '执行Robot');
  robot();
});