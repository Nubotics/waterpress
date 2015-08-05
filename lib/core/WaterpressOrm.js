/**
 * Created by nubuck on 15/07/09.
 */
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

//let extend = require('waterline/lib/waterline/utils/extend')

//models

var _usersUserModel = require('../users/user.model');

var _postsPostModel = require('../posts/post.model');

var _termsTermModel = require('../terms/term.model');

var _commentsCommentModel = require('../comments/comment.model');

var _ = require('lodash');
var WaterpressOrm = (function (_Waterline) {
  _inherits(WaterpressOrm, _Waterline);

  function WaterpressOrm() {
    _classCallCheck(this, WaterpressOrm);

    _Waterline.call(this);
    this.init.bind(this);
    this.load.bind(this);
    this.kill.bind(this);

    this._safeOverride.bind(this);
  }

  WaterpressOrm.prototype.init = function init(options, cb) {
    var config = {
      adapters: {
        'default': _sailsMysql2['default'],
        mysql: _sailsMysql2['default']
      },
      connections: {
        mysql: {
          adapter: 'mysql'
        }
      } /*,
        defaults: {
         migrate: 'safe'
        }*/
    };

    Object.keys(options).forEach(function (key) {
      if (_.has(config, key)) {
        config[key] = _.extend(config[key], options[key]);
      } else {
        config[key] = options[key];
      }
    });

    this.config = config;

    console.log('WaterpressOrm: config ext', this.config);

    //init models
    this._safeOverride('user', _usersUserModel.user);
    this._safeOverride('userMeta', _usersUserModel.userMeta);
    this._safeOverride('post', _postsPostModel.post);
    this._safeOverride('postMeta', _postsPostModel.postMeta);
    this._safeOverride('comment', _commentsCommentModel.comment);
    this._safeOverride('commentMeta', _commentsCommentModel.commentMeta);
    this._safeOverride('term', _termsTermModel.term);
    this._safeOverride('termTaxonomy', _termsTermModel.termTaxonomy);
    this._safeOverride('termRelationship', _termsTermModel.termRelationship);

    _Waterline.prototype.initialize.call(this, this.config, cb);
  };

  WaterpressOrm.prototype._safeOverride = function _safeOverride(key, model) {
    if (!_.has(this.config, 'override')) {
      this.load(model);
    } else {
      if (!_.has(this.config.override, 'model')) {
        this.load(model);
      } else if (_.has(this.config.override.model, key)) {
        console.log('Model override', key, this.config.override.model[key]);
        this.load(this.config.override.model[key]);
      } else {
        this.load(model);
      }
    }
  };

  WaterpressOrm.prototype.load = function load(collection) {
    this.loadCollection(_waterline2['default'].Collection.extend(collection));
  };

  WaterpressOrm.prototype.kill = function kill(cb) {
    console.log('teardown');
    this.teardown(cb);
  };

  return WaterpressOrm;
})(_waterline2['default']);

exports['default'] = WaterpressOrm;
module.exports = exports['default'];
//console.log('wp instance init', this)