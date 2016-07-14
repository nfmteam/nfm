'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { del } = require('../../../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
    '../lib/config': {
        'fs.base': basePath,
        '@global': true
    }
};
const fsApi = proxyquire('../../../../controllers/api/v1/fs', stubs);
const bodyParser = require('../../../../lib/bodyParser');
const apiParser = require('../../../../lib/apiParser');

const config = require('../../../../lib/config');
const deployDir = config['deploy.dir'];
const backupDir = config['backup.dir'];

const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

describe('fs delete测试', function () {

    before('before delete测试', function () {
        fs.ensureDirSync(basePath);
        fs.copySync(path.resolve(__dirname, '../../../files'), `${basePath}/files`);
    });

    after('after delete测试', function () {
        fs.removeSync(basePath);
    });

    beforeEach(function () {
        var app = koa();

        app.use(bodyParser);
        app.use(apiParser);
        app.use(fsApi.del);

        this.server = app.listen(8888);
    });

    afterEach(function () {
        this.server.close();
    });

    it('# 删除非空文件夹', function (done) {
        var data = {
            path: '/files'
        };

        del('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('目录非空');
                done();
            });
    });

    it('# 删除文件', function (done) {
        var p = '/files/lib/subdomain.js',
            data = {
                path: p
            };

        del('http://localhost:8888', data)
            .then(() => {
                if (!fs.existsSync(path.join(basePath, p))) {
                    done();
                }
            });
    });

    it('# 删除文件夹', function (done) {
        var p = '/files/lib',
            data = {
                path: p
            };

        // 文件夹只有备份, 发布目录, 算空
        fs.mkdirSync(path.join(basePath, p, deployDir));
        fs.mkdirSync(path.join(basePath, p, backupDir));

        del('http://localhost:8888', data)
            .then(() => {
                if (!fs.existsSync(path.join(basePath, p))) {
                    done();
                }
            });
    });

    it('# 删除根目录', function (done) {
        var p = '/',
            data = {
                path: p
            };

        del('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('根目录不能删除');
                done();
            });
    });

    it('# 入参错误', function (done) {
        del('http://localhost:8888')
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 路径不存在', function (done) {
        var data = {
                path: '/aa'
            };

        del('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

});