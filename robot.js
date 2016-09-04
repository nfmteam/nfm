'use strict';

const schedule = require('node-schedule');
const logger = require('./lib/logger');
const cleaner = require('./service/cleaner');
const config = require('./config');
const cron = config['robot.cron'];

schedule.scheduleJob(cron, () => {
  logger.info('[Robot Start]', '执行自动清理');
  cleaner();
});