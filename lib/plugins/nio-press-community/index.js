//:: NEW
//-> models
'use strict';

exports.__esModule = true;

var _models = require('./models');

//-> api

var _api = require('./api');

//:: OVERRIDES
//->models
var userModel = {
  attributes: {
    passportCollection: {
      collection: 'passport',
      via: 'user'
    },
    followersCollection: {
      collection: 'following',
      via: 'followUser'
    }
  }
};
//->api
var userApi = {
  one: function one(parans, cb, next) {},
  find: function find(params, cb, next) {},
  byRole: function byRole(roleName, cb, next) {},
  byPassport: function byPassport(params, cb, next) {},
  register: function register(userObj, cb, next) {},
  save: function save(userObj, cb, next) {}
};

//:: plugin
var pluginNioPressCommunity = {
  name: 'nio-press-community',
  modelCollection: [_models.bookmark, _models.curation, _models.curationBookmark, _models.following, _models.like, _models.passport, _models.read, _models.settings, _models.share],
  apiCollection: [_api.activityApi, _api.advertApi, _api.attachmentApi, _api.bookmarkApi, _api.storyApi],
  //-> overrides
  override: {
    model: {
      user: userModel
    },
    api: {
      user: userApi
    }
  }
};

//exports
exports['default'] = pluginNioPressCommunity;
module.exports = exports['default'];