'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addons = exports.methods = exports.models = exports.u = exports.Orm = exports.Api = exports.EventApi = undefined;

exports.default = function (options) {
  return new _core.Api(options);
};

var _core = require('./core');

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _addons = require('./addons');

var _addons2 = _interopRequireDefault(_addons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EventApi = _core.EventApi;
exports.Api = _core.Api;
exports.Orm = _core.Orm;
exports.u = _core.u;
exports.models = _models2.default;
exports.methods = _api2.default;
exports.addons = _addons2.default;