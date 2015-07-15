/**
 * Created by nubuck on 15/07/10.
 */

'use strict';

exports.__esModule = true;
var _ = require('lodash');

var findValue = function findValue(collection, keys) {
  var result = null;
  var item = null;
  if (_.isArray(keys)) {
    result = {};
    _.forEach(keys, function (key) {
      item = _.find(collection, { 'key': key });
      if (_.has(item, 'value')) {
        var _$extend;

        result = _.extend(result, (_$extend = {}, _$extend[key] = item.value, _$extend));
      }
    });
  } else {
    item = _.find(collection, { 'key': keys });
    if (_.has(item, 'value')) {
      var _result;

      result = (_result = {}, _result[keys] = item.value, _result);
    }
  }
  return result;
};

var makeObjectFromKeyCollection = function makeObjectFromKeyCollection(collection) {
  var result = {};
  _.forEach(collection, function (item) {
    //console.log('make from collection:', item)
    if (_.has(item, 'key') && _.has(item, 'value')) {
      var _$extend2;

      result = _.extend(result, (_$extend2 = {}, _$extend2[item.key] = item.value, _$extend2));
    }
  });
  return result;
};

exports._ = _;
exports.findValue = findValue;
exports.makeObjectFromKeyCollection = makeObjectFromKeyCollection;