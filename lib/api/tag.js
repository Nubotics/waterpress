'use strict';

exports.__esModule = true;
exports['default'] = {
  find: function find(params, cb, next) {
    if (this.collections) {
      cb(null, null, next);
    } else {
      cb('Not connected', null, next);
    }
  },
  one: function one(params, cb, next) {
    if (this.collections) {
      cb(null, null, next);
    } else {
      cb('Not connected', null, next);
    }
  }
};
module.exports = exports['default'];