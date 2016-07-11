'use strict';

const fs = require('fs-extra');
const is = require('type-is');
const formidable = require('formidable');
const config = require('../lib/config');

const keepExtensions = config['upload.keepExtensions'];
const multiples = config['upload.multiples'];
const uploadDir = `${config['fs.base']}/${config['upload.dir']}`;

fs.ensureDirSync(uploadDir);

module.exports = (ctx) => new Promise((resolve, reject) => {
    var form = new formidable.IncomingForm({
        keepExtensions,
        multiples,
        uploadDir
    });

    var fields = {};
    var files = {};

    form.on('end', function () {
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
        .on('fileBegin', function (name, file) {
            if (!is.is(file.type, config['upload.allowTypes'])) {
                throw Error(`不允许上传"${file.type}"`);
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

    form.parse(ctx.req);
});