//util
'use strict';

exports.__esModule = true;

var _addons = require('../../../addons');

var _ = _addons.pluginUtils._;
var assign = _addons.pluginUtils.assign;
var eachKey = _addons.pluginUtils.eachKey;
var findValue = _addons.pluginUtils.findValue;
var forEach = _addons.pluginUtils.forEach;
var has = _addons.pluginUtils.has;
var makeObjectFromKeyCollection = _addons.pluginUtils.makeObjectFromKeyCollection;
var merge = _addons.pluginUtils.merge;

//api
var categoryApi = {
  namespace: 'category',
  methods: {
    all: function all(params, cb, next) {}
  }
};

exports['default'] = {
  categoryApi: categoryApi

};
module.exports = exports['default'];