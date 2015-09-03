/**
 * Created by nubuck on 15/07/09.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreWaterPressOrm = require('./core/WaterPressOrm');

var _coreWaterPressOrm2 = _interopRequireDefault(_coreWaterPressOrm);

var _coreWaterpressApi = require('./core/WaterpressApi');

var _coreWaterpressApi2 = _interopRequireDefault(_coreWaterpressApi);

var _coreUtil = require('./core/util');

//raw models

var _usersUserModel = require('./users/user.model');

var _postsPostModel = require('./posts/post.model');

var _termsTermModel = require('./terms/term.model');

var _commentsCommentModel = require('./comments/comment.model');

//raw api

var _usersUserApi = require('./users/user.api');

var _usersUserApi2 = _interopRequireDefault(_usersUserApi);

var _postsPostApi = require('./posts/post.api');

var _postsPostApi2 = _interopRequireDefault(_postsPostApi);

var _termsTermApi = require('./terms/term.api');

var _termsTermApi2 = _interopRequireDefault(_termsTermApi);

var _commentsCommentApi = require('./comments/comment.api');

var _commentsCommentApi2 = _interopRequireDefault(_commentsCommentApi);

var util = { _: _coreUtil._, findValue: _coreUtil.findValue, makeObjectFromKeyCollection: _coreUtil.makeObjectFromKeyCollection };

var models = {
  user: _usersUserModel.user,
  userMeta: _usersUserModel.userMeta,
  post: _postsPostModel.post,
  postMeta: _postsPostModel.postMeta,
  term: _termsTermModel.term,
  termTaxonomy: _termsTermModel.termTaxonomy,
  termRelationship: _termsTermModel.termRelationship,
  comment: _commentsCommentModel.comment,
  commentMeta: _commentsCommentModel.commentMeta
};

var api = {
  user: _usersUserApi2['default'],
  post: _postsPostApi2['default'],
  term: _termsTermApi2['default'],
  comment: _commentsCommentApi2['default']
};

exports.WaterpressOrm = _coreWaterPressOrm2['default'];
exports.WaterpressApi = _coreWaterpressApi2['default'];
exports.util = util;
exports.models = models;
exports.api = api;