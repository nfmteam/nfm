'use strict';

module.exports = {

    index: function *() {
        this.render('index');
    },

    getList: function *() {
        this.info(123);
        this.body = {
            success: true
        }
    }
};