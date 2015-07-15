'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

var postApi = {
  all: function all(params, take, skip, chainStart, chainEnd, cb) {
    var _this = this;

    var action = function action(collections) {
      collections.post.find().where(params).populate('author').populate('relationshipCollection').populate('metaCollection').exec(function (e, posts) {

        if (chainEnd) {
          _this.safeKill(function () {
            cb(e, posts);
          });
        } else {
          cb(e, posts);
        }
      });
    };

    if (chainStart) {
      this.safeConnect(function (error) {
        if (error) throw error;
        action(_this.collections);
      });
    } else {
      action(this.collections);
    }
  },
  one: function one(params, chainStart, chainEnd, cb) {
    var _this2 = this;

    var action = function action(collections) {

      collections.post.findOne().where(params).populate('author').populate('relationshipCollection').populate('metaCollection').exec(function (e, post) {

        if (chainEnd) {
          _this2.safeKill(function () {
            cb(e, post);
          });
        } else {
          cb(e, post);
        }
      });
    };

    if (chainStart) {
      this.safeConnect(function (error) {
        if (error) throw error;
        action(_this2.collections);
      });
    } else {
      action(this.collections);
    }
  },
  next: function next() {},
  previous: function previous() {},
  byTerm: function byTerm() {},
  byAuthor: function byAuthor() {}
};

exports['default'] = postApi;
module.exports = exports['default'];