//libs
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _waterline = require('waterline');

var _waterline2 = _interopRequireDefault(_waterline);

var _sailsMysql = require('sails-mysql');

var _sailsMysql2 = _interopRequireDefault(_sailsMysql);

//util

var _util = require('./util');

//models
//import models from '../models'

//main

var Orm = (function (_Waterline) {
  _inherits(Orm, _Waterline);

  function Orm() {
    _classCallCheck(this, Orm);

    _Waterline.call(this);
    this._safeOverride.bind(this);
    this.init.bind(this);
    this.load.bind(this);
    this.kill.bind(this);
  }

  Orm.prototype._safeOverride = function _safeOverride(key, model) {
    if (!_util.has(this.config, 'override')) {
      this.load(model);
    } else {
      if (!_util.has(this.config.override, 'model')) {
        this.load(model);
      } else if (_util.has(this.config.override.model, key)) {
        this.load(this.config.override.model[key]);
      } else {
        this.load(model);
      }
    }
  };

  Orm.prototype.init = function init(options, models, cb) {
    var _this = this;

    var config = {
      adapters: {
        'default': _sailsMysql2['default'],
        mysql: _sailsMysql2['default']
      },
      connections: {
        mysql: {
          adapter: 'mysql'
        }
      }
    };

    _util.eachKey(options, function (key) {
      if (_util.has(config, key)) {
        config[key] = _util.assign(config[key], options[key]);
      } else {
        config[key] = options[key];
      }
    });

    this.config = config;

    //init models
    _util.eachKey(models, function (key) {
      _this._safeOverride(key, models[key]);
    });

    this.initialize(this.config, cb);
  };

  Orm.prototype.load = function load(collection) {
    this.loadCollection(_waterline2['default'].Collection.extend(collection));
  };

  Orm.prototype.kill = function kill(cb) {
    this.teardown(cb);
  };

  return Orm;
})(_waterline2['default']);

exports['default'] = Orm;
module.exports = exports['default'];