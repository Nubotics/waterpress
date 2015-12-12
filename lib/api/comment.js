//util
'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

//TODO: comment all
//methods
var find = function find(params, cb, next) {
  if (this.collections) {
    cb(null, { commentCollection: [] }, next);
  } else {
    cb('Not connected', null, next);
  }
};
var one = function one(params, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};
var save = function save(commentObj, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};
var kill = function kill(commentId, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};

//api export
exports['default'] = {
  find: find,
  one: one,
  save: save,
  kill: kill
};
module.exports = exports['default'];