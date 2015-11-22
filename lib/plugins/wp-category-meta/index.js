//models
'use strict';

exports.__esModule = true;

var _models = require('./models');

//api

var _api = require('./api');

//plugin
var pluginWpCategoryMeta = {
  name: 'nio-press-community',
  modelCollection: [_models.termMeta],
  //apiCollection: [],
  //-> overrides
  override: {
    model: { term: _models.term },
    api: { category: _api.categoryApi }
  }
};

//exports
exports['default'] = pluginWpCategoryMeta;
module.exports = exports['default'];