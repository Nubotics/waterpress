'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

var userApi = {
  one: function one(params, cb) {
    var _this = this;

    //console.log('one checking state', this.collections)
    this.safeConnect(function (error, collections) {
      if (error) throw error;

      collections.user.findOneWithMeta(params, function (err, user) {
        _this.safeKill(function () {
          cb(err, user);
        });
      });
    });
  },
  find: function find(params, cb) {
    var _this2 = this;

    this.safeConnect(function (error, collections) {
      if (error) throw error;

      collections.user.findWithMeta(params, function (e, userArr) {
        _this2.safeKill(function () {
          cb(e, userArr);
        });
      });
    });
  },
  byRole: function byRole(groupName, cb) {
    var _this3 = this;

    this.safeConnect(function (error, collections) {
      if (error) throw error;

      collections.usermeta.find().where({ key: 'wp_capabilities', value: { 'contains': groupName } }).exec(function (err, meta) {
        var userIdArr = [];
        if (meta) {

          meta.map(function (item) {
            //console.log('item', item.userId)
            userIdArr.push(item.userId);
          });

          _this3.safeKill(function () {
            console.log('map is sync', _this3.user.find);
            _this3.user.find({ id: userIdArr }, cb);
          });
        } else {

          _this3.safeKill(function () {
            cb(err, null);
          });
        }
      });
    });
  },
  existsByEmail: function existsByEmail(email, cb) {
    var _this4 = this;

    this.safeConnect(function (error, collections) {
      _this4.user.one({ email: email }, function (err, user) {
        _this4.safeKill(function () {
          if (user) {
            cb(err, true);
          } else {
            cb(err, false);
          }
        });
      });
    });
  },
  save: function save(userObj, cb) {
    var _this5 = this;

    //TODO: santiize userObj
    this.safeConnect(function (error, collections) {
      collections.user.one({ email: userObj.email }, function (err, user) {
        if (user) {

          collections.user.update({ id: userObj.id }, userObj).exec(function (e, users) {
            //TODO: validate the response before callback
            _this5.safeKill(function () {
              cb(e, users[0]);
            });
          });
        } else {

          collections.user.create(userObj).exec(function (e, user) {
            //TODO: validate the response before callback
            _this5.safeKill(function () {
              cb(e, user);
            });
          });
        }
      });
    });
  },
  login: function login(identifier, password, cb) {}

};

exports['default'] = userApi;
module.exports = exports['default'];