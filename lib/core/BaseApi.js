/**
 * Created by nubuck on 15/07/12.
 */
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _WaterpressOrm = require('./WaterpressOrm');

var _WaterpressOrm2 = _interopRequireDefault(_WaterpressOrm);

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _util = require('./util');

var BaseApi = (function (_EventEmitter) {
  function BaseApi(options) {
    _classCallCheck(this, BaseApi);

    _EventEmitter.call(this);
    if (!options) {
      throw 'options parameter required';
      //TODO: add more constructor validation
    }
    this.options = options;
    if (!_util._.has(options, 'Orm')) {
      this.options.Orm = _WaterpressOrm2['default'];
    }
    this.orm = null;
    this.collections = null;
    this.connections = null;
    this._bind('_connect', 'safeConnect', 'safeKill');
    this._isConnecting = false;
    this.clientConnections = 0;
  }

  _inherits(BaseApi, _EventEmitter);

  BaseApi.prototype._bind = function _bind() {
    var _this = this;

    for (var _len = arguments.length, methods = Array(_len), _key = 0; _key < _len; _key++) {
      methods[_key] = arguments[_key];
    }

    methods.forEach(function (method) {
      return _this[method] = _this[method].bind(_this);
    });
  };

  BaseApi.prototype._connect = function _connect(cb) {
    var _this2 = this;

    this.on('connected', cb, this);
    if (!this._isConnecting) {
      this._isConnecting = true;

      console.log('_connect', this.orm);

      if (this.orm && this.collections && this.connections) {
        this._isConnecting = false;
        this.emit('connected', err, this.collections);
      } else {
        this.orm = new this.options.Orm();
        this.orm.init(this.options, function (err, schema) {
          if (err) {
            console.log('Error in Waterpress API connecting to ORM: ', err);
            cb(err);
          } else {
            _this2.connections = schema.connections;
            _this2.collections = schema.collections;
            _this2._isConnecting = false;
            _this2.emit('connected', err, _this2.collections);
          }
        });
      }
    }
  };

  BaseApi.prototype.safeConnect = function safeConnect(cb) {
    console.log('checkAndConnect', this.clientConnections);
    this.clientConnections++;
    if (!this.connections) {
      console.log('no connection');
      this._connect(cb);
    } else {
      console.log('existing connection');
      cb(null, this.collections);
    }
  };

  BaseApi.prototype.safeKill = function safeKill(cb) {
    console.log('safe kill', this.clientConnections);
    if (this.clientConnections <= 1) {
      console.log('safe kill', 'kill');
      this.clientConnections = 0;
      this.orm.kill(cb);
    } else {
      console.log('safe kill', 'continue');
      this.clientConnections--;
      if (cb) cb();
    }
  };

  return BaseApi;
})(_eventemitter32['default']);

exports['default'] = BaseApi;
module.exports = exports['default'];