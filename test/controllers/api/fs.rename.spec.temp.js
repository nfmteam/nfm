'use strict';

const path = require('path');
const koa = require('koa');
const fs = require('fs-extra');
const { put } = require('../../fetch');
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

describe('fs rename测试', function () {

    before('before rename测试', function () {
        fs.ensureDirSync(basePath);
        fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
    });

    after('after rename测试', function () {
        fs.removeSync(basePath);
    });

    beforeEach(function () {
        var app = koa();

        app.use(bodyParser);
        app.use(apiParser);
        app.use(fsApi.rename);

        this.server = app.listen(8888);
    });

    afterEach(function () {
        this.server.close();
    });

    /**
     * 入参错误
     * 入参安全(重命名base之外的文件)
     * 入参路径不存在
     * 目标文件名已存在
     * 文件名不合法
     * 重命名目录
     * 重命名文件,包括备份,待发布文件
     */

    it('# 重命名文件夹', function (done) {
        var data = {
            src: '/rename-one',
            name: 'one'
        };

        put('http://localhost:8888', data)
            .then(function () {
                if (fs.existsSync(path.join(basePath, '/one'))) {
                    done();
                }
            });
    });

    it('# 重命名文件', function (done) {
        var data = {
            src: '/files/README.md',
            name: 'README2.md'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fs.existsSync(path.join(basePath, '/files/README2.md'))
                    && !fs.existsSync(path.join(basePath, '/files/README.md'))) {
                    done();
                }
            });
    });

    it('# 重命名文件,待发布文件,备份文件', function (done) {
        var data = {
            src: '/files/package.json',
            name: 'package2.json'
        };

        /**
         * 上个测试中重命名文件夹
         * fs-extra move方法会被触发
         * 该方法移动文件的时候会创建不存在的目录
         * 翻阅源码,发现move方法存在文档中不存在的option mkdir
         * 默认设置为true,会保证文件夹存在
         */
        // fs.mkdirSync(path.join(basePath, 'files', deployDir));
        fs.copySync(
            path.join(basePath, 'files/package.json'),
            path.join(basePath, `files/${deployDir}/package.json`)
        );
        fs.mkdirSync(path.join(basePath, `files/${backupDir}/package.json`));

        put('http://localhost:8888', data)
            .then(() => {
                if (fs.existsSync(path.join(basePath, '/files/package2.json'))
                    && !fs.existsSync(path.join(basePath, '/files/package.json'))
                    && fs.existsSync(path.join(basePath, `/files/${deployDir}/package2.json`))
                    && !fs.existsSync(path.join(basePath, `/files/${deployDir}/package.json`))
                    && fs.existsSync(path.join(basePath, `/files/${backupDir}/package2.json`))
                    && !fs.existsSync(path.join(basePath, `/files/${backupDir}/package.json`))) {
                    done();
                }
            });
    });

    it('# 入参错误', function (done) {
        var data = {
            src: '/rename-one'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 路径不存在', function (done) {
        var data = {
            src: '/aaaaa',
            name: 'aa'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 文件名不合法', function (done) {
        var data = {
            src: '/rename-two',
            name: '!!'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('文件名不合法');
                done();
            });
    });

    it('# 目标名称已存在', function (done) {
        var data = {
            src: '/rename-two',
            name: 'rename-three'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('rename-three已存在');
                done();
            });
    });

});