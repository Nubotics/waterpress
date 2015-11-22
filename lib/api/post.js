//util
'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

//methods
//general crud
var find = function find(params, options, cb, next) {
  if (this.collections) {

    var query = this.collections.post.find().where(params);

    if (_coreUtil.has(options, 'limit')) {
      query.limit(options.limit);
    }

    if (_coreUtil.has(options, 'skip')) {
      query.skip(options.skip);
    }

    if (_coreUtil.has(options, 'sort')) {
      query.sort(options.sort);
    }

    query.populate('author').populate('relationshipCollection').populate('metaCollection').exec(function (e, postCollection) {
      cb(e, postCollection, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};
var older = function older(lastId, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};
var newer = function newer(firstId, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};
var one = function one(params, cb, next) {
  if (this.collections) {
    this.collections.post.findOne().where(params).populate('author').populate('relationshipCollection').populate('metaCollection').exec(function (e, post) {
      cb(e, post, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};
var save = function save(postObj, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};
var kill = function kill(postId, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};
//help crud
var findChildren = function findChildren(postId, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};

//api export
exports['default'] = {
  find: find,
  older: older,
  newer: newer,
  one: one,
  save: save,
  kill: kill,
  findChildren: findChildren

};
module.exports = exports['default'];