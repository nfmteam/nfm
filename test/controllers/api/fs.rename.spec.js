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

const fsExists = p => fs.existsSync(path.join(basePath, p));

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

    it('# 入参测试:src省略', function (done) {
        var data = {
            name: 'name'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 入参测试:name省略', function (done) {
        var data = {
            src: 'src'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 入参测试:src安全:安全src存在', function (done) {
        var data = {
            src: '../../../file1.js',
            name: 'file1_rename.js'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/file1_rename.js') && !fsExists('/file1.js')) {
                    done();
                }
            });
    });

    it('# 入参测试:src安全:安全src不存在', function (done) {
        var data = {
            src: '../../../aaaaa',
            name: 'bbbbb'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 入参测试:src不存在', function (done) {
        var data = {
            src: '/aaaaa',
            name: 'bbbbb'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 入参测试:name不合法', function (done) {
        var data = {
            src: '/deploy1.js',
            name: '测试.js'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('文件名不合法');
                done();
            });
    });

    it('# 重命名:name已存在:name为文件', function (done) {
        var data = {
            src: '/deploy2.js',
            name: '.hiddenfile1.js'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('.hiddenfile1.js已存在');
                done();
            });
    });

    it('# 重命名:name已存在:name为目录', function (done) {
        var data = {
            src: '/dir1',
            name: 'dir2'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('dir2已存在');
                done();
            });
    });

    it('# 重命名:目录', function (done) {
        var data = {
            src: '/dir1',
            name: 'dir1_rename'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/dir1_rename') && !fsExists('/dir1')) {
                    done();
                }
            });
    });

    it('# 重命名:文件:不包括备份&不包括待发布', function (done) {
        var data = {
            src: '/file2.js',
            name: 'file2_rename.js'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/file2_rename.js')
                    && !fsExists('/file2.js')) {
                    done();
                }
            });
    });

    it('# 重命名:文件:包括备份&不包括待发布', function (done) {
        var data = {
            src: '/backup1.js',
            name: 'backup1_rename.js'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/backup1_rename.js') && !fsExists('/backup1.js')
                    && fsExists(`/${backupDir}/backup1_rename.js`)
                    && fsExists(`/${backupDir}/backup1_rename.js/1.bak`)
                    && fsExists(`/${backupDir}/backup1_rename.js/2.bak`)
                    && !fsExists(`/${backupDir}/backup1.js`)) {
                    done();
                }
            });
    });

    it('# 重命名:文件:不包括备份&包括待发布', function (done) {
        var data = {
            src: '/deploy3.js',
            name: 'deploy3_rename.js'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/deploy3_rename.js') && !fsExists('/deploy3.js')
                    && fsExists(`/${deployDir}/deploy3_rename.js`)
                    && !fsExists(`/${deployDir}/deploy3.js`)) {
                    done();
                }
            });
    });

    it('# 重命名:文件:包括备份&包括待发布', function (done) {
        var data = {
            src: '/deploy_backup1.js',
            name: 'deploy_backup1_rename.js'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/deploy_backup1_rename.js') && !fsExists('/deploy_backup1.js')
                    && fsExists(`/${deployDir}/deploy_backup1_rename.js`)
                    && !fsExists(`/${deployDir}/deploy_backup1.js`)
                    && fsExists(`/${backupDir}/deploy_backup1_rename.js`)
                    && fsExists(`/${backupDir}/deploy_backup1_rename.js/1.bak`)
                    && fsExists(`/${backupDir}/deploy_backup1_rename.js/2.bak`)
                    && !fsExists(`/${backupDir}/deploy_backup1.js`)) {
                    done();
                }
            });
    });

});