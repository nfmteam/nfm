'use strict';

const schedule = require('node-schedule');
const cleaner = require('./service/cleaner');
const config = require('./config');
const cron = config['robot.cron'];

schedule.scheduleJob(cron, () => cleaner());