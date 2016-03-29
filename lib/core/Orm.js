'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _waterline = require('waterline');

var _waterline2 = _interopRequireDefault(_waterline);

var _sailsMysql = require('sails-mysql');

var _sailsMysql2 = _interopRequireDefault(_sailsMysql);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //libs


//util


//models
//import models from '../models'

//main

var Orm = function (_Waterline) {
  _inherits(Orm, _Waterline);

  function Orm() {
    _classCallCheck(this, Orm);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Orm).call(this));

    _this._safeOverride.bind(_this);
    _this.init.bind(_this);
    _this.load.bind(_this);
    _this.kill.bind(_this);

    return _this;
  }

  _createClass(Orm, [{
    key: '_safeOverride',
    value: function _safeOverride(key, model) {
      if (!(0, _util.has)(this.config, 'override')) {
        this.load(model);
      } else {
        if (!(0, _util.has)(this.config.override, 'model')) {
          this.load(model);
        } else if ((0, _util.has)(this.config.override.model, key)) {
          this.load(this.config.override.model[key]);
        } else {
          this.load(model);
        }
      }
    }
  }, {
    key: 'init',
    value: function init(options, models, cb) {
      var _this2 = this;

      var config = {
        adapters: {
          default: _sailsMysql2.default,
          mysql: _sailsMysql2.default
        },
        connections: {
          mysql: {
            adapter: 'mysql'
          }
        }
      };

      (0, _util.eachKey)(options, function (key) {
        if ((0, _util.has)(config, key)) {
          config[key] = (0, _util.assign)(config[key], options[key]);
        } else {
          config[key] = options[key];
        }
      });

      this.config = config;

      //init models
      (0, _util.eachKey)(models, function (key) {
        _this2._safeOverride(key, models[key]);
      });

      this.initialize(this.config, cb);
    }
  }, {
    key: 'load',
    value: function load(collection) {
      this.loadCollection(_waterline2.default.Collection.extend(collection));
    }
  }, {
    key: 'kill',
    value: function kill(cb) {
      this.teardown(cb);
    }
  }]);

  return Orm;
}(_waterline2.default);

exports.default = Orm;
module.exports = exports['default'];