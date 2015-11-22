//util
'use strict';

exports.__esModule = true;

var _addons = require('../../../addons');

var _ = _addons.pluginUtils._;
var assign = _addons.pluginUtils.assign;
var eachKey = _addons.pluginUtils.eachKey;
var findValue = _addons.pluginUtils.findValue;
var forEach = _addons.pluginUtils.forEach;
var has = _addons.pluginUtils.has;
var makeObjectFromKeyCollection = _addons.pluginUtils.makeObjectFromKeyCollection;
var merge = _addons.pluginUtils.merge;

//create API
var activityApi = {
  namespace: 'activity',
  methods: {}
};

var advertApi = {
  namespace: 'advert',
  methods: {}
};

var bookmarkApi = {
  namespace: 'bookmark',
  methods: {}
};

var followingApi = {
  namespace: 'following',
  methods: {}
};

var imperativeApi = {
  namespace: 'imperative',
  methods: {}
};

var likeApi = {
  namespace: 'like',
  methods: {}
};

var profileApi = {
  namespace: 'profile',
  methods: {
    all: function all(params, cb, next) {},
    one: function one(params, cb, next) {},
    byRole: function byRole(roleName, cb, next) {}
  }
};

var shareApi = {
  namespace: 'share',
  methods: {}
};

var storyApi = {
  namespace: 'story',
  methods: {
    all: function all(params, cb, next) {},
    older: function older(lastId, cb, next) {},
    newer: function newer(firstId, cb, next) {},
    one: function one(params, cb, next) {},
    create: function create(storyObj, cb, next) {},
    update: function update(storyObj, cb, next) {}
  }
};

var storyReadApi = {
  namespace: 'story',
  methods: {}
};

exports['default'] = {
  activityApi: activityApi,
  advertApi: advertApi,
  bookmarkApi: bookmarkApi,
  followingApi: followingApi,
  imperativeApi: imperativeApi,
  likeApi: likeApi,
  profileApi: profileApi,
  shareApi: shareApi,
  storyApi: storyApi,
  storyReadApi: storyReadApi

};
module.exports = exports['default'];