'use strict';

const path = require('path');
const koa = require('koa');
const router = require('koa-router')();
const fs = require('fs-extra');
const FormData = require('form-data');
const { upload } = require('../../fetch');
const config = require('../../../config');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const deployDir = config['deploy.dir'];
const stubs = {
    '../config': {
        'fs.base': basePath,
        '@global': true
    }
};
const uploadApi = proxyquire('../../../controllers/api/upload', stubs);
const bodyParser = require('../../../lib/bodyParser');
const apiParser = require('../../../lib/apiParser');

const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

const filesPath = path.resolve(__dirname, '../../files');

describe('fs upload测试', function () {

    beforeEach(function () {
        fs.ensureDirSync(basePath);
        fs.ensureDirSync(`${basePath}/${config['upload.dir']}`);

        var app = koa();

        app.use(bodyParser);

        router.all('*', apiParser);
        router.post('/api/upload', uploadApi);

        app.use(router.routes());

        this.server = app.listen(8888);
    });

    afterEach(function () {
        this.server.close();

        fs.removeSync(basePath);
    });

    it('# 单文件上传', function (done) {
        var uploadDir = '/',
            form = new FormData(),
            headers = form.getHeaders();

        form.append('path', uploadDir);
        form.append('files', fs.createReadStream(`${filesPath}/lib/subdomain.js`));

        upload(`http://localhost:8888/api/upload`, form, headers)
            .then(() => {
                if (fs.existsSync(path.join(basePath, 'subdomain.js'))) {
                    done();
                }
            });
    });

    it('# 多文件上传1', function (done) {
        var uploadDir = '/',
            form = new FormData(),
            headers = form.getHeaders();

        form.append('path', uploadDir);
        form.append('files', fs.createReadStream(`${filesPath}/README.md`));
        form.append('files', fs.createReadStream(`${filesPath}/package.json`));

        upload(`http://localhost:8888/api/upload`, form, headers)
            .then(() => {
                if (fs.existsSync(path.join(basePath, 'README.md'))
                    && fs.existsSync(path.join(basePath, 'package.json'))) {
                    done();
                }
            });
    });

    it('# 多文件上传2', function (done) {
        var uploadDir = '/',
            form = new FormData(),
            headers = form.getHeaders();

        form.append('path', uploadDir);
        form.append('a', 'value1');
        form.append('a', 'value2');
        form.append('a', 'value3');

        // 部分代码只有两个以上的文件才能跑到
        form.append('files', fs.createReadStream(`${filesPath}/README.md`));
        form.append('files', fs.createReadStream(`${filesPath}/package.json`));
        form.append('files', fs.createReadStream(`${filesPath}/.gitignore`));

        upload(`http://localhost:8888/api/upload`, form, headers)
            .then(() => {
                if (fs.existsSync(path.join(basePath, 'README.md'))
                    && fs.existsSync(path.join(basePath, 'package.json'))) {
                    done();
                }
            });
    });

    it('# 入参错误:未传path', function (done) {
        var form = new FormData(),
            headers = form.getHeaders();

        upload(`http://localhost:8888/api/upload`, form, headers)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 入参错误:path不存在', function (done) {
        var uploadDir = '/keenwon',
            form = new FormData(),
            headers = form.getHeaders();

        form.append('path', uploadDir);

        upload(`http://localhost:8888/api/upload`, form, headers)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 入参错误:files不存在', function (done) {
        var uploadDir = '/',
            form = new FormData(),
            headers = form.getHeaders();

        form.append('path', uploadDir);

        upload(`http://localhost:8888/api/upload`, form, headers)
            .then(response => {
                response.message.should.equal('files字段为空');
                done();
            });
    });

    it('# 文件已存在, 待发布', function (done) {
        var uploadDir = '/',
            form1 = new FormData(),
            headers1 = form1.getHeaders();

        form1.append('path', uploadDir);
        form1.append('files', fs.createReadStream(`${filesPath}/README.md`));

        upload(`http://localhost:8888/api/upload`, form1, headers1)
            .then(() => {

                var form2 = new FormData(),
                    headers2 = form2.getHeaders();

                form2.append('path', uploadDir);
                form2.append('files', fs.createReadStream(`${filesPath}/README.md`));

                upload(`http://localhost:8888/api/upload`, form2, headers2)
                    .then(() => {
                        if(fs.existsSync(path.join(basePath, deployDir, 'README.md'))) {
                            done();
                        }
                    });
            });
    });

    it('# 无效文件名', function (done) {
        var uploadDir = '/',
            form = new FormData(),
            headers = form.getHeaders();

        form.append('path', uploadDir);
        form.append('files', fs.createReadStream(`${filesPath}/测试.txt`));

        upload(`http://localhost:8888/api/upload`, form, headers)
            .then(response => {
                response.message.should.equal('无效文件名:"测试.txt"');
                done();
            });
    });

});