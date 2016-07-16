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

describe('fs move测试', function () {

    before('before move测试', function () {
        fs.ensureDirSync(basePath);
        fs.copySync(path.resolve(__dirname, '../../files'), `${basePath}`);
    });

    after('after move测试', function () {
        fs.removeSync(basePath);
    });

    beforeEach(function () {
        var app = koa();

        app.use(bodyParser);
        app.use(apiParser);
        app.use(fsApi.move);

        this.server = app.listen(8888);
    });

    afterEach(function () {
        this.server.close();
    });

    it('# 入参测试:src省略', function (done) {
        var data = {
            dest: '/dest'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 入参测试:dest省略', function (done) {
        var data = {
            src: '/src'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 入参测试:src安全:安全src存在', function (done) {
        var data = {
            src: '../../../dir1',
            dest: 'dir2'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/dir2/dir1') && !fsExists('/dir1')) {
                    done();
                }
            });
    });

    it('# 入参测试:src安全:安全src不存在', function (done) {
        var data = {
            src: '../../../aaaaa',
            dest: 'bbbbb'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 入参测试:dest安全:安全dest存在', function (done) {
        var data = {
            src: '/dir2/dir1',
            dest: '../../../'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (!fsExists('/dir2/dir1') && fsExists('/dir1')) {
                    done();
                }
            });
    });

    it('# 入参测试:dest安全:安全dest不存在', function (done) {
        var data = {
            src: '/dir1',
            dest: '../../../aaaaa'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 入参测试:dest不是目录', function (done) {
        var data = {
            src: '/dir1',
            dest: '/file1.js'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('目标路径必须是目录');
                done();
            });
    });

    it('# 入参测试:dest是待发布&备份文件夹', function (done) {
        var data = {
            src: '/dir1',
            dest: '/,nfm_backup/backup1.js'
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
            dest: '/dir1'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 入参测试:dest不存在', function (done) {
        var data = {
            src: '/dir1',
            dest: '/aaaaa'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('路径不存在');
                done();
            });
    });

    it('# 入参测试:src=dest', function (done) {
        var data = {
            src: '/dir1',
            dest: '/dir1'
        };

        put('http://localhost:8888', data)
            .then(response => {
                response.message.should.equal('入参错误');
                done();
            });
    });

    it('# 移动:目录', function (done) {
        var data = {
            src: '/dir1',
            dest: '/dir2'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/dir2/dir1') && !fsExists('/dir1')) {
                    done();
                }
            });
    });

    it('# 移动:文件:不包含备份&不包含待发布', function (done) {
        var data = {
            src: '/.hiddenfile1.js',
            dest: '/dir3'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/dir3/.hiddenfile1.js') && !fsExists('/.hiddenfile1.js')) {
                    done();
                }
            });
    });

    it('# 移动:文件:包含备份&不包含待发布', function (done) {
        var data = {
            src: '/backup1.js',
            dest: '/dir3'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/dir3/backup1.js') && !fsExists('/backup1.js')
                    && fsExists(`/dir3/${backupDir}/backup1.js`)
                    && fsExists(`/dir3/${backupDir}/backup1.js/1.bak`)
                    && fsExists(`/dir3/${backupDir}/backup1.js/2.bak`)
                    && !fsExists(`/${backupDir}/backup1.js`)) {
                    done();
                }
            });
    });

    it('# 移动:文件:不包含备份&包含待发布', function (done) {
        var data = {
            src: '/deploy1.js',
            dest: '/dir3'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/dir3/deploy1.js') && !fsExists('/deploy1.js')
                    && fsExists(`/dir3/${deployDir}/deploy1.js`)
                    && !fsExists(`/${deployDir}/deploy1.js`)) {
                    done();
                }
            });
    });

    it('# 移动:文件:包含备份&包含待发布', function (done) {
        var data = {
            src: '/deploy_backup1.js',
            dest: '/dir3'
        };

        put('http://localhost:8888', data)
            .then(() => {
                if (fsExists('/dir3/deploy_backup1.js') && !fsExists('/deploy_backup1.js')
                    && fsExists(`/dir3/${deployDir}/deploy_backup1.js`)
                    && !fsExists(`/${deployDir}/deploy_backup1.js`)
                    && fsExists(`/dir3/${backupDir}/deploy_backup1.js`)
                    && fsExists(`/dir3/${backupDir}/deploy_backup1.js/1.bak`)
                    && fsExists(`/dir3/${backupDir}/deploy_backup1.js/2.bak`)
                    && !fsExists(`/${backupDir}/deploy_backup1.js`)) {
                    done();
                }
            });
    });

});