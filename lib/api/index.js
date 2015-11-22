'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _attachment = require('./attachment');

var _attachment2 = _interopRequireDefault(_attachment);

var _category = require('./category');

var _category2 = _interopRequireDefault(_category);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _media = require('./media');

var _media2 = _interopRequireDefault(_media);

var _page = require('./page');

var _page2 = _interopRequireDefault(_page);

var _post = require('./post');

var _post2 = _interopRequireDefault(_post);

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

var _tag = require('./tag');

var _tag2 = _interopRequireDefault(_tag);

var _term = require('./term');

var _term2 = _interopRequireDefault(_term);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

exports['default'] = {
  attachment: _attachment2['default'],
  category: _category2['default'],
  comment: _comment2['default'],
  media: _media2['default'],
  page: _page2['default'],
  post: _post2['default'],
  format: _format2['default'],
  tag: _tag2['default'],
  term: _term2['default'],
  user: _user2['default']

};
module.exports = exports['default'];