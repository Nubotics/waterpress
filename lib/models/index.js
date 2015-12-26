'use strict';

exports.__esModule = true;

var _user = require('./user');

var _post = require('./post');

var _term = require('./term');

var _comment = require('./comment');

var _option = require('./option');

exports['default'] = {
  //user.js
  user: _user.user,
  userMeta: _user.userMeta,

  //post.js
  post: _post.post,
  postMeta: _post.postMeta,

  //term.js
  term: _term.term,
  termTaxonomy: _term.termTaxonomy,
  termRelationship: _term.termRelationship,

  //comment.js
  comment: _comment.comment,
  commentMeta: _comment.commentMeta,

  //option.js
  option: _option.option
};
module.exports = exports['default'];