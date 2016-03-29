'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../core/util');

//libs
var hasher = require('wordpress-hash-node');

//util


//:: reference
/*
 * wp_capabilities:
 * ----------------
 * a:1:{s:10:"subscriber";b:1;} - Subscriber
 * a:1:{s:11:"contributor";b:1;} - Contributor
 * a:1:{s:6:"author";b:1;} - Author
 * a:1:{s:6:"editor";b:1;} - Editor
 * a:1:{s:13:"administrator";b:1;} - Administrator
 *
 * wp_user_level:
 * --------------
 * 0 - Subscriber
 * 1 - Contributor
 * 2 - Author
 * 3 - Editor
 * 4 - Administrator
 *
 * meta fields:
 * ------------
 * nickname
 * first_name
 * last_name
 * description
 * wp_user_level
 * wp_capabilities
 *
 * */

//methods

var find = function find(params, cb, next) {
  if (this.collections) {
    this.collections.user.findWithMeta(params, function (e, userArr) {
      cb(e, userArr, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};
var one = function one(params, cb, next) {
  if (this.collections) {
    this.collections.user.findOneWithMeta(params, function (err, user) {
      cb(err, user, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};
var byRole = function byRole(roleName, cb, next) {
  var _this = this;

  if (this.collections) {
    this.collections.usermeta.find().where({ key: 'wp_capabilities', value: { 'contains': roleName } }).exec(function (err, meta) {
      var userIdArr = [];
      if (meta) {
        meta.map(function (item) {
          userIdArr.push(item.user);
        });
        _this.collections.user.findWithMeta({ id: userIdArr }, function (e, userArr) {
          cb(e, userArr, next);
        });
      } else {
        cb(err, null, next);
      }
    });
  } else {
    cb('Not connected', null, next);
  }
};
var existsByEmail = function existsByEmail(email, cb, next) {
  one.call(this, { email: email }, function (err, user) {
    var result = false;
    if (user) result = true;
    cb(err, result, next);
  });
};
var save = function save(userObj, cb, next) {
  var _this2 = this;

  if (this.collections) {
    (function () {
      var id = userObj.id;
      var email = userObj.email;

      var updateAction = function updateAction() {
        _this2.collections.user.update({ id: id }, userObj).exec(function (e, users) {
          //TODO: validate the response before callback
          var resultUser = undefined;
          if (Array.isArray(users)) {
            if (users.length > 0) {
              resultUser = users[0];
            }
          }
          cb(e, resultUser, next);
        });
      };
      var createAction = function createAction() {
        _this2.collections.user.create(userObj).exec(function (e, user) {
          //TODO: validate the response before callback
          cb(e, user, next);
        });
      };

      _this2.collections.user.findOne({ email: email }, function (err, user) {
        if (user) {
          updateAction();
        } else {
          createAction();
        }
      });
    })();
  } else {
    cb('Not connected', null, next);
  }
};
var checkLogin = function checkLogin(email, password, cb, next) {
  if (this.collections) {
    var hash = hasher.HashPassword(password);
    this.collections.user.findOne({ email: email, password: hash }, function (err, user) {
      cb(err, user, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};

//api export
exports.default = {
  find: find,
  one: one,
  byRole: byRole,
  existsByEmail: existsByEmail,
  save: save,
  checkLogin: checkLogin
};
module.exports = exports['default'];