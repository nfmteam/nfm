'use strict';

const Promise = require('bluebird');
const moment = require('moment');
const fs = require('../utils/fsHelper').fsExtra;
const formidable = require('formidable');
const execa = require('execa');

const config = require('../config');
const keepExtensions = config['upload.keepExtensions'];
const multiples = config['upload.multiples'];
const uploadDir = `${config['fs.base']}/${config['upload.dir']}`;
const uploadKeepTime = config['upload.keepTime'];

module.exports = {

  /**
   * 上传文件
   */
  uploader: (ctx) => new Promise((resolve, reject) => {
    var form = new formidable.IncomingForm({
      keepExtensions,
      multiples,
      uploadDir
    });

    var fields = {};
    var files = {};

    form
      .on('end', function () {
        resolve({ fields: fields, files: files });
      })
      .on('error', function (err) {
        reject(err);
      })
      .on('field', function (field, value) {
        if (fields[field]) {
          if (Array.isArray(fields[field])) {
            fields[field].push(value);
          } else {
            fields[field] = [fields[field], value];
          }
        } else {
          fields[field] = value;
        }
      })
      .on('file', function (field, file) {
        if (files[field]) {
          if (Array.isArray(files[field])) {
            files[field].push(file);
          } else {
            files[field] = [files[field], file];
          }
        } else {
          files[field] = file;
        }
      });

    // 上传前确保目录存在
    fs.ensureDirAsync(uploadDir)
      .then(form.parse(ctx.req));
  }),

  unzip: function (absZipFile) {
    var unzipPath = absZipFile.replace(/upload_(\w+)$/, 'unzip_$1');

    return execa
      .shell(`unzip -q ${absZipFile} -d ${unzipPath}`)
      .then(() => unzipPath)
      .catch(() => {
        throw Error('zip文件损坏')
      });
  },

  /**
   * 清理上传文件
   */
  clean: function () {
    return fs.readdirAsync(uploadDir)
      .catchReturn(Promise.resolve([]))
      .then(files => files.map(file => ({
        path: file,
        stat: fs.statSync(`${uploadDir}/${file}`)
      })))
      .then(files => files.forEach(file => {
        if (moment() - moment(file.stat.mtime) > uploadKeepTime) {
          fs.removeSync(`${uploadDir}/${file.path}`);
        }
      }));
  }

};