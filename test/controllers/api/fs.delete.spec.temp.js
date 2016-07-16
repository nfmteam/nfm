'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { del } = require('../../fetch');
const proxyquire = require('proxyquire').noPreserveCache();
const basePath = '/tmp/nfm-test';
const stubs = {
    '../config': {
        'fs.base': basePath,
        '@global': true
    }
};
const fsApi = proxyquire('../../../controllers/api/fs', stubs);
const bodyParser = require('../../../lib/bodyParser');
const apiParser = require('../../../lib/apiParser');

const config = require('../../../config');
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
        fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
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

    /**
     * 入参错误
     * 入参为空(根目录)
     * 入参安全(突破base目录)
     * 入参路径不合法(乱七八糟)
     * 路径不存在
     * 删除根目录
     * 删除文件(不含待发布文件,备份文件)
     * 删除文件(含待发布文件,备份文件)
     * 删除目录
     * 删除非空目录(递归判断是否有文件,排除备份,待发布目录)
     */

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

    it('# 待发布文件同时被删除', function (done) {
        var p = '/files/test/lib/request.js',
            data = {
                path: p
            };

        var { dir, base } = path.parse(p),
            absFilePath = path.join(basePath, p),
            absDeployDir = path.join(basePath, dir, deployDir),
            absDestFilePath = path.join(absDeployDir, base);

        fs.mkdirSync(absDeployDir);
        fs.copySync(absFilePath, absDestFilePath);

        del('http://localhost:8888', data)
            .then(() => {
                if (!fs.existsSync(absFilePath) && !fs.existsSync(absDestFilePath)) {
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