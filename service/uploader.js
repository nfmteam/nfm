'use strict';

const fs = require('../utils/fsHelper').fsExtra;
const formidable = require('formidable');
const unzip = require('unzip');
const config = require('../config');

const keepExtensions = config['upload.keepExtensions'];
const multiples = config['upload.multiples'];
const uploadDir = `${config['fs.base']}/${config['upload.dir']}`;

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

  unzip: (absZipFile) => new Promise(function (resolve, reject) {
    var reader = fs.createReadStream(absZipFile)
      .on('error', error => {
        reject(error);
      });

    var unzipPath = absZipFile.replace(/upload_(\w+)$/, 'unzip_$1');

    var parser = new unzip.Extract({ path: unzipPath })
      .on('error', () => {
        reject('zip文件损坏');
      });

    reader
      .pipe(parser)
      .on('close', () => {
        resolve(unzipPath);
      });
  })

};