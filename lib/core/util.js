'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _nioTools = require('nio-tools');

var _nioTools2 = _interopRequireDefault(_nioTools);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateUuid = function generateUuid() {
  return _nodeUuid2.default.v1();
};
exports.default = _extends({ generateUuid: generateUuid }, _nioTools2.default);
module.exports = exports['default'];