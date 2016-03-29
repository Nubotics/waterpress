'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventApi2 = require('./EventApi');

var _EventApi3 = _interopRequireDefault(_EventApi2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _util = require('./util');

var _Orm = require('./Orm');

var _Orm2 = _interopRequireDefault(_Orm);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //libs


//util


/*
 * API interface
 *
 * pure function action
 *
 * */

//main

var Api = function (_EventApi) {
  _inherits(Api, _EventApi);

  function Api(options) {
    _classCallCheck(this, Api);

    /*
     * deconstructable options:
     * -> base:object
     * -> db:object
     * -> instance:object
     * -> pluginCollection:array
     * */

    if (!options) {
      throw 'options parameter required';
      //TODO: add more constructor validation
    }

    //:: check for base opts
    //-> chain api
    //-> eventemmitter
    var baseOpts = {};
    if ((0, _util.has)(options, 'base')) {
      baseOpts = options.eventApi;
    }

    //:: init Event Api base class


    //:: check for instance opts
    //-> connections
    //-> collections

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Api).call(this, baseOpts));

    var hasInstance = false;
    if ((0, _util.has)(options, 'instance')) {
      if ((0, _util.has)(options.instance, 'connections')) {
        _this.set('connections', options.instance.connections, true);
      }
      if ((0, _util.has)(options.instance, 'collections')) {
        _this.set('collections', options.instance.collections, true);
      }
      if ((0, _util.has)(_this, 'connections') && (0, _util.has)(_this, 'collections')) {
        hasInstance = true;
      }
    }
    //-> set instance flag
    _this.set('hasInstance', hasInstance, true);

    //:: check db waterline connection options
    if ((0, _util.has)(options, 'db')) {
      _this.setOption('db', options.db);
    }

    //:: Waterline data instance
    _this.set('orm', null, true);

    //:: if !instance
    if (!_this.hasInstance) {}

    //:: check for plugins opts
    var pluginCollection = [];
    if ((0, _util.has)(options, 'plugins')) {
      if (Array.isArray(options.plugins)) {
        pluginCollection = options.plugins;
      }
    }

    //:: flatten plugin tree
    var pluginNames = [];
    //-> models
    var newModelCollection = {};
    var overrideModelCollection = {};
    //-> api
    var newApiCollection = {};
    var overrideApiCollection = {};
    //-> deconstruct
    if (pluginCollection.length > 0) {
      (0, _util.forEach)(pluginCollection, function (plugin) {
        if ((0, _util.has)(plugin, 'name')) {
          pluginNames.push(plugin.name);
          //-> new models
          if ((0, _util.has)(plugin, 'modelCollection')) {
            if (Array.isArray(plugin.modelCollection)) {
              (0, _util.forEach)(plugin.modelCollection, function (model) {
                if ((0, _util.has)(model, 'identity')) {
                  newModelCollection[model.identity] = model;
                }
              });
            }
          }
          //-> new api
          if ((0, _util.has)(plugin, 'apiCollection')) {
            if (Array.isArray(plugin.apiCollection)) {
              (0, _util.forEach)(plugin.apiCollection, function (api) {
                if ((0, _util.has)(api, 'namespace')) {
                  newApiCollection[api.namespace] = api.methods;
                }
              });
            }
          }
          //-> overrides
          if ((0, _util.has)(plugin, 'override')) {
            //--> override models
            if ((0, _util.has)(plugin.override, 'model')) {
              if (plugin.override.model) {
                (0, _util.eachKey)(plugin.override.model, function (overModelKey) {
                  overrideModelCollection = (0, _util.merge)(overrideModelCollection, _defineProperty({}, overModelKey, plugin.override.model[overModelKey]));
                });
              }
            }
            //--> override apis
            if ((0, _util.has)(plugin.override, 'api')) {
              if (plugin.override.api) {
                (0, _util.eachKey)(plugin.override.api, function (overApiKey) {
                  overrideApiCollection = (0, _util.merge)(overrideApiCollection, _defineProperty({}, overApiKey, plugin.override.api[overApiKey]));
                });
              }
            }
          }
        }
        //-> no plugin name
        //TODO: does a plugin need a name?
      });
    }
    _this.set('pluginNames', pluginNames);

    //:: safe loadable collections
    var mergeModelOverrides = function mergeModelOverrides(original, override) {
      (0, _util.eachKey)(original, function (ogKey) {
        if ((0, _util.has)(override, ogKey)) {
          original[ogKey] = (0, _util.merge)(original[ogKey], override[ogKey]);
        }
      });
      return original;
    };
    //-> models
    var modelCollection = {};
    (0, _util.eachKey)(_models2.default, function (modKey) {
      if ((0, _util.has)(overrideModelCollection, modKey)) {
        modelCollection[modKey] = mergeModelOverrides(_models2.default[modKey], overrideModelCollection[modKey]);
      } else {
        modelCollection = (0, _util.merge)(modelCollection, _defineProperty({}, modKey, _models2.default[modKey]));
      }
    });
    modelCollection = (0, _util.merge)(modelCollection, newModelCollection);
    _this.set('modelCollection', modelCollection);
    //-> api
    var apiCollection = {};
    (0, _util.eachKey)(_api2.default, function (apiKey) {
      if ((0, _util.has)(overrideApiCollection, apiKey)) {
        apiCollection = (0, _util.merge)(apiCollection, (0, _util.merge)(_api2.default[apiKey], overrideApiCollection[apiKey]));
      } else {
        apiCollection = (0, _util.merge)(apiCollection, _defineProperty({}, apiKey, _api2.default[apiKey]));
      }
    });
    apiCollection = (0, _util.merge)(apiCollection, newApiCollection);

    //:: Bind.bind ^_^
    _this._bind.bind(_this);
    _this._bind('connect', 'disconnect', 'plug');

    //:: construct api methods
    (0, _util.eachKey)(apiCollection, function (structKey) {
      if ((0, _util.has)(apiCollection, structKey)) {
        _this._addMethods(apiCollection[structKey], structKey)._addMethod('done', function (cb, next) {
          if (cb) {
            cb(next);
          } else {
            next();
          }
        }, structKey, true);
      }
    });

    return _this;
  }

  _createClass(Api, [{
    key: '_bind',
    value: function _bind() {
      var _this2 = this;

      for (var _len = arguments.length, methods = Array(_len), _key = 0; _key < _len; _key++) {
        methods[_key] = arguments[_key];
      }

      methods.forEach(function (method) {
        return _this2[method] = _this2[method].bind(_this2);
      });
    }
  }, {
    key: 'connect',
    value: function connect(cb) {
      var _this3 = this;

      this.chain(function (next) {
        if (_this3.hasInstance) {
          if (cb) {
            var collections = _this3.collections;
            var connections = _this3.connections;

            cb(null, { collections: collections, connections: connections }, next);
          } else {
            next();
          }
        } else {
          _this3.orm = new _Orm2.default();
          _this3.orm.init({
            connections: _this3.options.db.connections
          }, _this3.modelCollection, function (err, models) {
            if (err) throw err;
            if ((0, _util.has)(models, 'connections')) {
              _this3.set('connections', models.connections, true);
            }
            if ((0, _util.has)(models, 'collections')) {
              _this3.set('collections', models.collections, true);
            }
            if (cb) {
              cb(err, models, next);
            } else {
              next();
            }
          });
        }
      });
      return this;
    }
  }, {
    key: 'disconnect',
    value: function disconnect(cb) {
      var _this4 = this;

      this.chain(function (next) {
        if (_this4.orm) {
          if (cb) {
            _this4.orm.kill(function () {
              cb(next);
            });
          } else {
            _this4.orm.kill(next);
          }
        } else {
          if (cb) {
            cb(next);
          } else {
            next();
          }
        }
      });
      return this;
    }
  }, {
    key: 'end',
    value: function end(cb) {
      this.chain(function (next) {
        if (cb) {
          cb(next);
        } else {
          next();
        }
      });
      return this;
    }
  }, {
    key: 'plug',
    value: function plug(cb, namespace) {
      var _this5 = this;

      this.chain(function (next) {
        var args = [_this5, next];
        cb.apply(_this5, args);
      });
      if (namespace) {
        if ((0, _util.has)(this, namespace)) {
          return this[namespace];
        } else {
          return this;
        }
      } else {
        return this;
      }
    }
  }]);

  return Api;
}(_EventApi3.default);

//exports


exports.default = Api;
module.exports = exports['default'];