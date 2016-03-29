'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../core/util');

var checkHasPassport = function checkHasPassport(userObj) {
  var result = false;
  if ((0, _util.has)(userObj, 'passportCollection')) {
    //console.log('CHECKHASPASSPORT', userObj.passportCollection.length, userObj.passportCollection)
    if (userObj.passportCollection.length > 0) result = true;
  }
  return result;
}; //util


var guaranteePassword = function guaranteePassword(userObj) {
  var result = generatePassword();
  if ((0, _util.has)(userObj, 'password')) {
    if (userObj.password.length > 5) {
      result = userObj.password;
    }
  }
  return result;
};

var assembleUser = function assembleUser(userObj) {
  var firstName = userObj.firstName;
  var lastName = userObj.lastName;
  var email = userObj.email;
  var password = userObj.password;
  var url = userObj.url;

  var proxyUser = {
    //id: 0,
    slug: userObj.firstName + '-' + userObj.lastName,
    displayName: userObj.firstName + ' ' + userObj.lastName,
    userName: email,
    email: email,
    password: password,
    registeredAt: new Date(),
    status: 0,
    url: url,
    metaCollection: [{
      //id: 0,
      //user: 0,
      key: 'nickname',
      value: userObj.firstName
    }, {
      key: 'first_name',
      value: userObj.firstName
    }, {
      key: 'last_name',
      value: userObj.lastName
    }, {
      key: 'mobile',
      value: userObj.mobile
    }, {
      key: 'description',
      value: ''
    }, {
      key: 'nio_avatar',
      value: userObj.avatar
    }, {
      key: 'wp_capabilities',
      value: 'a:1:{s:10:"subscriber";b:1;}'
    }, {
      key: 'wp_user_level',
      value: '0'
    }]
  };

  proxyUser.metaCollection = (0, _util.assign)(proxyUser.metaCollection, userObj.metaCollection);

  if (hasPassport) {
    proxyUser.passportCollection = userObj.passportCollection;
  } else {
    proxyUser.passportCollection = [];
  }

  return proxyUser;
};

exports.default = {
  checkHasPassport: checkHasPassport,
  guaranteePassword: guaranteePassword,
  assembleUser: assembleUser

};
module.exports = exports['default'];