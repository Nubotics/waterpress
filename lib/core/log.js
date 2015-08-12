'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function logger(color, label, message) {
  if (!message) {} else {}
}

exports['default'] = {
  out: function out(label, message) {
    logger(_chalk2['default'].white, label, message);
  },
  info: function info(label, message) {
    logger(_chalk2['default'].cyan, label, message);
  },
  success: function success(label, message) {
    logger(_chalk2['default'].green, label, message);
  },
  warn: function warn(label, message) {
    logger(_chalk2['default'].yellow, label, message);
  },
  fail: function fail(label, message) {
    logger(_chalk2['default'].red, label, message);
  }
};
module.exports = exports['default'];

//console.log(color(label))

//console.log(color(label), message)