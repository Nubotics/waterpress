//util
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreUtil = require('../core/util');

var _term = require('./term');

var _term2 = _interopRequireDefault(_term);

var _assemblers = require('../assemblers');

var _assemblers2 = _interopRequireDefault(_assemblers);

var find = function find(params, isFlat, cb, next) {

  var isFlatValue = false;
  var query = { taxonomy: 'category' };

  if (isFlat) {
    isFlatValue = isFlat;
  }

  query = _coreUtil.assign(params, query);

  _term2['default'].byTaxonomy.call(this, query, function (err, collection) {
    if (err) {
      cb(err, collection, next);
    } else {
      var categoryCollection = _assemblers2['default'].category.collection(collection, null, isFlatValue);
      cb(err, categoryCollection, next);
    }
  });
};

var one = function one(params, cb, next) {
  var query = { taxonomy: 'category' };
  query = _coreUtil.assign(params, query);
  _term2['default'].byTaxonomy.call(this, query, function (err, collection) {

    if (err) {
      cb(err, null, next);
    } else {
      if (collection && _coreUtil._.isArray(collection)) {
        if (collection.length > 0) {
          var entity = collection[0];
          var category = _assemblers2['default'].category.entity(entity, null, false);
          cb(err, category, next);
        } else {
          cb(err, null, next);
        }
      } else {
        cb(err, null, next);
      }
    }
  }, next);
};

//main
exports['default'] = { find: find, one: one };
module.exports = exports['default'];