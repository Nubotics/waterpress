'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _deepMerge = require('deep-merge');

var _deepMerge2 = _interopRequireDefault(_deepMerge);

var assign = function assign(source, override) {
  return _lodash2['default'].assign(_lodash2['default'].clone(source), override);
};
var eachKey = function eachKey(object, cb) {
  _lodash2['default'].forEach(Object.keys(object), function (key, i) {
    cb(key, i);
  });
};
var makeKey = function makeKey(key) {
  return _lodash2['default'].snakeCase(key);
};
var findValue = function findValue(collection, keys) {
  var result = null;
  var item = null;
  if (_lodash2['default'].isArray(keys)) {
    result = {};
    forEach(keys, function (key) {
      item = _lodash2['default'].find(collection, { 'key': key });
      if (has(item, 'value')) {
        var _$extend;

        result = _lodash2['default'].extend(result, (_$extend = {}, _$extend[key] = item.value, _$extend));
      }
    });
  } else {
    item = _lodash2['default'].find(collection, { 'key': keys });
    if (has(item, 'value')) {
      var _result;

      result = (_result = {}, _result[keys] = item.value, _result);
    }
  }
  return result;
};
var forEach = _lodash2['default'].forEach;
var has = _lodash2['default'].has;
var makeObjectFromKeyCollection = function makeObjectFromKeyCollection(collection) {
  var result = {};
  forEach(collection, function (item) {
    //console.log('make from collection:', item)
    if (has(item, 'key') && has(item, 'value')) {
      var _assign;

      result = assign(result, (_assign = {}, _assign[item.key] = item.value, _assign));
    }
  });
  return result;
};
var makeObject = makeObjectFromKeyCollection;
var merge = _deepMerge2['default'](function (target, source, key) {
  if (target instanceof Array) {
    return [].concat(target, source);
  }
  return source;
});

exports['default'] = {
  _: _lodash2['default'],
  assign: assign,
  eachKey: eachKey,
  makeKey: makeKey,
  findValue: findValue,
  forEach: forEach,
  has: has,
  makeObjectFromKeyCollection: makeObjectFromKeyCollection,
  makeObject: makeObject,
  merge: merge

};
module.exports = exports['default'];