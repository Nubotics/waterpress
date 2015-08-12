'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

var userApi = {
  one: function one(params, chainStart, chainEnd, cb) {
    var _this = this;

    //console.log('one checking state', this.collections)
    var action = function action(collections) {
      //console.log('find one user, chainend', chainEnd, collections)
      collections.user.findOneWithMeta(params, function (err, user) {
        if (chainEnd) {
          //console.log('ABOUT TO SAFE KILL')
          _this.safeKill(function () {
            cb(err, user);
          });
        } else {
          cb(err, user);
        }
      });
    };
    //console.log('find one user, chainstart', chainStart)
    if (chainStart) {
      this.safeConnect(function (error) {
        if (error) throw error;
        action(_this.collections);
      });
    } else {
      action(this.collections);
    }
  },
  find: function find(params, chainStart, chainEnd, cb) {
    var _this2 = this;

    var action = function action(collections) {
      collections.user.findWithMeta(params, function (e, userArr) {
        if (chainEnd) {
          //console.log('find ABOUT TO SAFE KILL')
          _this2.safeKill(function () {
            cb(e, userArr);
          });
        } else {
          cb(e, userArr);
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
  byRole: function byRole(roleName, chainStart, chainEnd, cb) {
    var _this3 = this;

    var subAction = function subAction(params) {
      _this3.user.find(params, false, chainEnd, cb);
    };

    var action = function action(collections) {
      collections.usermeta.find().where({ key: 'wp_capabilities', value: { 'contains': roleName } }).exec(function (err, meta) {
        var userIdArr = [];
        if (meta) {

          meta.map(function (item) {
            //console.log('item', item.userId)
            userIdArr.push(item.user);
          });

          subAction({ id: userIdArr });
        } else {

          if (chainEnd) {
            //console.log('byRole 2 ABOUT TO SAFE KILL')
            _this3.safeKill(function () {
              cb(err, null);
            });
          } else {
            cb(err, null);
          }
        }
      });
    };

    if (chainStart) {
      this.safeConnect(function (error) {
        if (error) throw error;
        action(_this3.collections);
      });
    } else {
      action(this.collections);
    }
  },
  existsByEmail: function existsByEmail(email, chainStart, chainEnd, cb) {
    var _this4 = this;

    var action = function action() {
      _this4.user.one({ email: email }, false, false, function (err, user) {

        if (chainEnd) {

          _this4.safeKill(function () {
            if (user) {
              cb(err, true);
            } else {
              cb(err, false);
            }
          });
        } else {

          if (user) {
            cb(err, true);
          } else {
            cb(err, false);
          }
        }
      });
    };

    if (chainStart) {
      this.safeConnect(function (error) {
        if (error) throw error;
        action();
      });
    } else {
      action();
    }
  },
  save: function save(userObj, chainStart, chainEnd, cb) {
    var _this5 = this;

    var updateAction = function updateAction(collections) {

      //console.log('UPDATE USER ACTION', userObj)

      collections.user.update({ id: userObj.id }, userObj).exec(function (e, users) {
        //TODO: validate the response before callback
        if (chainEnd) {

          _this5.safeKill(function () {
            cb(e, users[0]);
          });
        } else {
          cb(e, users[0]);
        }
      });
    };

    var createAction = function createAction(collections) {

      //console.log('CREATE USER ACTION', userObj)

      collections.user.create(userObj).exec(function (e, user) {
        //TODO: validate the response before callback
        if (chainEnd) {

          _this5.safeKill(function () {
            cb(e, user);
          });
        } else {
          cb(e, user);
        }
      });
    };

    var action = function action(collections) {
      collections.user.findOne({ email: userObj.email }, function (err, user) {
        if (user) {

          updateAction(collections);
        } else {

          createAction(collections);
        }
      });
    };

    //TODO: santiize userObj
    if (chainStart) {

      this.safeConnect(function (error) {
        if (error) throw error;

        action(_this5.collections);
      });
    } else {

      action(this.collections);
    }
  },
  login: function login(identifier, password, chainConnection, cb) {}

};

exports['default'] = userApi;
module.exports = exports['default'];