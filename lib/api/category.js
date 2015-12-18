//util
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreUtil = require('../core/util');

var _term = require('./term');

var _term2 = _interopRequireDefault(_term);

var _assemblers = require('../assemblers');

var _assemblers2 = _interopRequireDefault(_assemblers);

var pushChildToTermInCollection = function pushChildToTermInCollection(taxCollection, childCollection) {
  var foundChildCollection = [];
  return _coreUtil._.map(taxCollection, function (tax) {
    tax.childCollection = [];
    foundChildCollection = _coreUtil._.filter(childCollection, { parent: tax.term.id });
    if (_coreUtil._.isArray(foundChildCollection)) {
      tax.childCollection = foundChildCollection;
    }
    return tax;
  });
};

var find = function find(params, cb, next) {
  var _this = this;

  if (this.collections) {
    (function () {
      var query = { taxonomy: 'category' };
      var termIdCollection = [];

      _this.collections.termtaxonomy.find().where(query).populate('term')
      //.populate('childCollection')
      .exec(function (err, collection) {
        if (err) {
          cb(err, collection, next);
        } else {
          if (_coreUtil._.isArray(collection)) {
            termIdCollection = collection.map(function (termTax) {
              return termTax.term.id;
            });
            if (termIdCollection.length > 0) {
              params = _coreUtil.assign({ id: termIdCollection }, params);
              _this.collections.term.find().where(params).exec(function (error, termCollection) {
                cb(error, _assemblers2['default'].category.detailCollection(collection, termCollection), next);
              });
            } else {
              cb(err, collection, next);
            }
          } else {
            cb(err, collection, next);
          }
        }
      });
    })();
  } else {
    cb('Not connected', null, next);
  }
};

var findChildren = function findChildren(params, cb, next) {
  var _this2 = this;

  if (this.collections) {
    (function () {
      var parent = 0;
      if (_coreUtil.has(params, 'parent')) parent = params.parent;

      var parentQuery = parent;
      if (parent == 0) parentQuery = { '!': 0 };

      var query = { taxonomy: 'category', parent: parentQuery };
      var termIdCollection = [];

      _this2.collections.termtaxonomy.find().where(query).populate('term')
      //.populate('childCollection')
      .exec(function (err, collection) {
        if (err) {
          cb(err, collection, next);
        } else {
          if (_coreUtil._.isArray(collection)) {
            termIdCollection = collection.map(function (termTax) {
              return termTax.term.id;
            });
            if (termIdCollection.length > 0) {
              _this2.collections.term.find().where({ id: termIdCollection }).exec(function (error, termCollection) {
                //cb(error, termCollection, next)
                cb(error, _assemblers2['default'].category.detailCollection(collection, termCollection), next);
              });
            } else {
              cb(err, collection, next);
            }
          } else {
            cb(err, collection, next);
          }
        }
      });
    })();
  } else {
    cb('Not connected', null, next);
  }
};
var findWithChildren = function findWithChildren(params, cb, next) {
  var _this3 = this;

  if (this.collections) {
    (function () {
      //-> defaults
      var query = { taxonomy: 'category', parent: 0 };
      var termCollection = [];
      var termIdCollection = [];
      var childTermIdCollection = [];

      //-> helpers

      //-> find -> top level termTaxonomy
      //-> by -> tax = category
      _this3.collections.termtaxonomy.find().where(query)
      //.populate('childCollection')
      .populate('term')
      //.populate('parent')
      .exec(function (err, collection) {
        if (err || !_coreUtil._.isArray(collection)) {
          console.log('findWithChildren -> err', err);
          cb(err, collection, next);
        } else {

          termCollection = _coreUtil._.pluck(collection, 'term');
          termIdCollection = _coreUtil._.pluck(termCollection, 'id');

          findChildren.call(_this3, { parent: termIdCollection }, function (err, childCategoryCollection) {

            var result = pushChildToTermInCollection(collection, childCategoryCollection);

            var categoryCollection = _assemblers2['default'].category.collectionWithChildren(result);

            console.log('findWithChildren -> err,categoryCollection', err, categoryCollection);

            cb(err, categoryCollection, next);
          });
        }
      });
    })();
  } else {
    cb('Not connected', null, next);
  }
};

var one = function one(params, cb, next) {
  if (this.collections) {
    find.call(this, params, function (err, categoryCollection) {
      if (err) {
        cb(err, null, next);
      } else {
        if (categoryCollection) {
          if (_coreUtil._.isArray(categoryCollection)) {
            if (categoryCollection.length > 0) {
              cb(err, categoryCollection[0], next);
            } else {
              cb(err, null, next);
            }
          } else {
            cb(err, categoryCollection, next);
          }
        } else {
          cb(err, null, next);
        }
      }
    });
  } else {
    cb('Not connected', null, next);
  }
};

//main
exports['default'] = { find: find, findChildren: findChildren, findWithChildren: findWithChildren, one: one };
module.exports = exports['default'];