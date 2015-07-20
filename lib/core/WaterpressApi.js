/**
 * Created by nubuck on 15/07/10.
 */
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _BaseApi = require('./BaseApi');

var _BaseApi2 = _interopRequireDefault(_BaseApi);

//import orm from './WaterpressOrm'

var _util = require('./util');

//api

var _usersUserApi = require('../users/user.api');

var _usersUserApi2 = _interopRequireDefault(_usersUserApi);

var _postsPostApi = require('../posts/post.api');

var _postsPostApi2 = _interopRequireDefault(_postsPostApi);

var _termsTermApi = require('../terms/term.api');

var _termsTermApi2 = _interopRequireDefault(_termsTermApi);

var _commentsCommentApi = require('../comments/comment.api');

var _commentsCommentApi2 = _interopRequireDefault(_commentsCommentApi);

var WaterpressApi = (function (_Base) {
  _inherits(WaterpressApi, _Base);

  function WaterpressApi(options, cb) {
    _classCallCheck(this, WaterpressApi);

    //TODO: validate options
    _Base.call(this, options);

    this._bindApiMethods.bind(this);
    this._safeBindApiMethods.bind(this);

    this._safeBindApiMethods('user', _usersUserApi2['default']);
    this._safeBindApiMethods('post', _postsPostApi2['default']);
    this._safeBindApiMethods('term', _termsTermApi2['default']);
    this._safeBindApiMethods('comment', _commentsCommentApi2['default']);

    if (cb) {
      this.safeConnect(cb);
    }
  }

  WaterpressApi.prototype._safeBindApiMethods = function _safeBindApiMethods(namespace, api) {
    if (_util._.has(this.options, 'override')) {
      if (_util._.has(this.options.override, 'api')) {
        if (_util._.has(this.options.override.api, namespace)) {
          this._bindApiMethods(namespace, this.options.override.api[namespace]);
        } else {
          this._bindApiMethods(namespace, api);
        }
      } else {
        this._bindApiMethods(namespace, api);
      }
    } else {
      this._bindApiMethods(namespace, api);
    }
  };

  WaterpressApi.prototype._bindApiMethods = function _bindApiMethods(namespace, api) {
    var _this = this;

    if (!_util._.has(this, namespace)) {
      this[namespace] = _util._.extend({}, api);
    } else {
      this[namespace] = _util._.extend(this[namespace], api);
    }
    Object.keys(api).forEach(function (key) {
      _this[namespace][key] = _this[namespace][key].bind(_this);
    });
  };

  return WaterpressApi;
})(_BaseApi2['default']);

exports['default'] = WaterpressApi;
module.exports = exports['default'];