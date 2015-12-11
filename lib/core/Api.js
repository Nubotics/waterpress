//libs
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _EventApi2 = require('./EventApi');

var _EventApi3 = _interopRequireDefault(_EventApi2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

//util

var _util = require('./util');

/*
 * API interface
 *
 * pure function action
 *
 * */

var _Orm = require('./Orm');

var _Orm2 = _interopRequireDefault(_Orm);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

//main

var Api = (function (_EventApi) {
  _inherits(Api, _EventApi);

  function Api(options) {
    var _this = this;

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
    if (_util.has(options, 'base')) {
      baseOpts = options.eventApi;
    }

    //:: init Event Api base class
    _EventApi.call(this, baseOpts);

    //:: check for instance opts
    //-> connections
    //-> collections
    var hasInstance = false;
    if (_util.has(options, 'instance')) {
      if (_util.has(options.instance, 'connections')) {
        this.set('connections', options.instance.connections, true);
      }
      if (_util.has(options.instance, 'collections')) {
        this.set('collections', options.instance.collections, true);
      }
      if (_util.has(this, 'connections') && _util.has(this, 'collections')) {
        hasInstance = true;
      }
    }
    //-> set instance flag
    this.set('hasInstance', hasInstance, true);

    //:: check db waterline connection options
    if (_util.has(options, 'db')) {
      this.setOption('db', options.db);
    }

    //:: Waterline data instance
    this.set('orm', null, true);

    //:: if !instance
    if (!this.hasInstance) {}

    //:: check for plugins opts
    var pluginCollection = [];
    if (_util.has(options, 'plugins')) {
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
      _util.forEach(pluginCollection, function (plugin) {
        if (_util.has(plugin, 'name')) {
          pluginNames.push(plugin.name);
          //-> new models
          if (_util.has(plugin, 'modelCollection')) {
            if (Array.isArray(plugin.modelCollection)) {
              _util._.forEach(plugin.modelCollection, function (model) {
                if (_util.has(model, 'identity')) {
                  newModelCollection[model.identity] = model;
                }
              });
            }
          }
          //-> new api
          if (_util.has(plugin, 'apiCollection')) {
            if (Array.isArray(plugin.apiCollection)) {
              _util._.forEach(plugin.apiCollection, function (api) {
                if (_util.has(api, 'namespace')) {
                  newApiCollection[api.namespace] = api.methods;
                }
              });
            }
          }
          //-> overrides
          if (_util.has(plugin, 'override')) {
            //--> override models
            if (_util.has(plugin, 'model')) {
              if (plugin.model) {
                _util.eachKey(plugin.model, function (overModelKey) {
                  overrideModelCollection = _util.merge(overrideModelCollection, plugin.model[overModelKey]);
                });
              }
            }
            //--> override apis
            if (_util.has(plugin, 'api')) {
              if (plugin.api) {
                _util.eachKey(plugin.api, function (overApiKey) {
                  overrideApiCollection = _util.merge(overrideApiCollection, plugin.api[overApiKey]);
                });
              }
            }
          }
        }
        //-> no plugin name
        //TODO: does a plugin need a name?
      });
    }
    this.set('pluginNames', pluginNames);

    //:: safe loadable collections
    //-> models
    var modelCollection = {};
    _util.eachKey(_models2['default'], function (modKey) {
      if (_util.has(overrideModelCollection, modKey)) {
        modelCollection = _util.merge(modelCollection, _util.merge(_models2['default'][modKey], overrideModelCollection[modKey]));
      } else {
        var _merge;

        modelCollection = _util.merge(modelCollection, (_merge = {}, _merge[modKey] = _models2['default'][modKey], _merge));
      }
    });
    modelCollection = _util.merge(modelCollection, newModelCollection);
    this.set('modelCollection', modelCollection);
    //-> api
    var apiCollection = {};
    _util.eachKey(_api2['default'], function (apiKey) {
      if (_util.has(overrideApiCollection, apiKey)) {
        apiCollection = _util.merge(apiCollection, _util.merge(_api2['default'][apiKey], overrideApiCollection[apiKey]));
      } else {
        var _merge2;

        apiCollection = _util.merge(apiCollection, (_merge2 = {}, _merge2[apiKey] = _api2['default'][apiKey], _merge2));
      }
    });
    apiCollection = _util.merge(apiCollection, newApiCollection);

    //:: Bind.bind ^_^
    this._bind.bind(this);
    this._bind('connect', 'disconnect', 'plug');

    //:: construct api methods
    _util.eachKey(apiCollection, function (structKey) {
      if (_util.has(apiCollection, structKey)) {
        _this._addMethods(apiCollection[structKey], structKey)._addMethod('done', function (cb, next) {
          //console.log('done', cb, next)
          if (cb) {
            cb(next);
          } else {
            next();
          }
        }, structKey, true);
      }
    });
  }

  Api.prototype._bind = function _bind() {
    var _this2 = this;

    for (var _len = arguments.length, methods = Array(_len), _key = 0; _key < _len; _key++) {
      methods[_key] = arguments[_key];
    }

    methods.forEach(function (method) {
      return _this2[method] = _this2[method].bind(_this2);
    });
  };

  Api.prototype.connect = function connect(cb) {
    var _this3 = this;

    this.chain(function (next) {
      console.log('connect -> hasInstance', _this3.hasInstance);
      if (_this3.hasInstance) {
        if (cb) {
          var collections = _this3.collections;
          var connections = _this3.connections;

          console.log('connect -> collections, connections ', collections, connections);
          cb(null, { collections: collections, connections: connections }, next);
        } else {
          next();
        }
      } else {
        _this3.orm = new _Orm2['default']();
        _this3.orm.init({
          connections: _this3.options.db.connections
        }, _this3.modelCollection, function (err, models) {
          //console.log('orm init -> err, models', err, models)
          if (err) throw err;
          if (_util.has(models, 'connections')) {
            //console.log('orm init -> has connections')
            _this3.set('connections', models.connections, true);
          }
          if (_util.has(models, 'collections')) {
            //console.log('orm init -> has collections')
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
  };

  Api.prototype.disconnect = function disconnect(cb) {
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
  };

  Api.prototype.plug = function plug(cb, namespace) {
    var _this5 = this;

    this.chain(function (next) {
      var args = [_this5, next];
      cb.apply(_this5, args);
    });
    if (namespace) {
      if (_util.has(this, namespace)) {
        return this[namespace];
      } else {
        return this;
      }
    } else {
      return this;
    }
  };

  return Api;
})(_EventApi3['default']);

//exports
exports['default'] = Api;
module.exports = exports['default'];