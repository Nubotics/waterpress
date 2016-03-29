'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../core/util');

var _post = require('./post');

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//main
//util
exports.default = {
  find: function find(params, cb, next) {
    params = (0, _util.merge)(params, { postType: 'page' });
    _post2.default.find.call(this, params, {}, function (err, pageCollection) {
      cb(err, pageCollection, next);
    });
  },
  one: function one(params, cb, next) {
    params = (0, _util.merge)(params, { postType: 'page' });
    _post2.default.find.call(this, params, {}, function (err, page) {
      cb(err, page, next);
    });
  },
  save: function save(postObj, cb, next) {
    postObj = (0, _util.merge)(postObj, { postType: 'page' });
    _post2.default.save.call(this, postObj, function (err, page) {
      cb(err, page, next);
    });
  },
  kill: function kill(postId, cb, next) {
    _post2.default.kill.call(this, postId, function (err, result) {
      cb(err, result, next);
    });
  }
};
module.exports = exports['default'];