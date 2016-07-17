'use strict';

const fsHelper = require('../utils/fsHelper');
const formidable = require('formidable');
const config = require('../config');

const keepExtensions = config['upload.keepExtensions'];
const multiples = config['upload.multiples'];
const uploadDir = `${config['fs.base']}/${config['upload.dir']}`;

module.exports = (ctx) => new Promise((resolve, reject) => {
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
  fsHelper.fsExtra
    .ensureDirAsync(uploadDir)
    .then(form.parse(ctx.req));
});