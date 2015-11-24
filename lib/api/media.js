//util
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreUtil = require('../core/util');

var _post = require('./post');

var _post2 = _interopRequireDefault(_post);

//main
exports['default'] = {
  find: function find(params, cb, next) {
    params = _coreUtil.assign(params, { postType: 'attachment' });
    _post2['default'].find.call(this, params, {}, function (err, pageCollection) {
      cb(err, pageCollection, next);
    });
  },
  one: function one(params, cb, next) {
    params = _coreUtil.assign(params, { postType: 'attachment' });
    _post2['default'].find.call(this, params, {}, function (err, page) {
      cb(err, page, next);
    });
  },
  save: function save(postObj, cb, next) {
    if (this.collections) {
      cb(null, null, next);
    } else {
      cb('Not connected', null, next);
    }
  },
  kill: function kill(postId, cb, next) {
    if (this.collections) {
      cb(null, null, next);
    } else {
      cb('Not connected', null, next);
    }
  }
};
module.exports = exports['default'];