'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
//TODO: tag -> all
exports.default = {
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