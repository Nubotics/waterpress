//util
'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

//methods
var find = function find(params, cb, next) {
  cb(null, { commentCollection: [] }, next);
};
var one = function one(params, cb, next) {
  cb(null, null, next);
};
var save = function save(commentObj, cb, next) {
  cb(null, null, next);
};
var kill = function kill(commentId, cb, next) {
  cb(null, null, next);
};

//api export
exports['default'] = {
  find: find,
  one: one,
  save: save,
  kill: kill
};
module.exports = exports['default'];