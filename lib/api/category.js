//util
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreUtil = require('../core/util');

var _term = require('./term');

var _term2 = _interopRequireDefault(_term);

var _assemblers = require('../assemblers');

var _assemblers2 = _interopRequireDefault(_assemblers);

var pushChildToTermInCollection = function pushChildToTermInCollection(termId, termCollection, childTerm) {
  return _coreUtil._.map(termCollection, function (term) {
    if (term.id === termId) {
      if (_coreUtil.has(term, 'childCollection')) {
        term.childCollection.push(childTerm);
      } else {
        term.childCollection = [];
        term.childCollection.push(childTerm);
      }
      return term;
    } else {
      return term;
    }
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
              params = _coreUtil.assign({ id: termIdCollection }, params);
              _this2.collections.term.find().where(params).exec(function (error, termCollection) {
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
      var query = { taxonomy: 'category', parent: 0 };
      var termIdCollection = [];
      var childTermIdCollection = [];

      _this3.collections.termtaxonomy.find().where(query).populate('term').populate('childCollection').exec(function (err, collection) {
        if (err) {
          cb(err, collection, next);
        } else {
          if (_coreUtil._.isArray(collection)) {
            //console.log('findWithChildren -> collection', collection)
            collection.map(function (termTax) {
              termIdCollection.push(termTax.term.id);
              if (_coreUtil.has(termTax, 'childCollection')) {
                if (_coreUtil._.isArray(termTax.childCollection)) {
                  termTax.childCollection.map(function (childTermTax) {
                    termIdCollection.push(childTermTax.term);
                    childTermIdCollection.push({ termId: childTermTax.term, parent: termTax.term.id });
                  });
                }
              }
            });

            //let categoryCollection = assembler.category.collection(collection,null,false)

            var getTermDetail = function getTermDetail(termCb) {
              if (termIdCollection.length > 0) {
                params = _coreUtil.assign({ id: termIdCollection }, params);
                _this3.collections.term.find().where(params).exec(function (error, termCollection) {

                  if (error) {
                    cb(error, termCollection, next);
                  } else {

                    if (termCollection) {
                      (function () {
                        var resultTermCollection = [];
                        var resultChildTermCollection = [];

                        termCollection.map(function (term) {
                          var currentTermTax = _coreUtil._.find(childTermIdCollection, { termId: term.id });
                          if (!currentTermTax) {
                            resultTermCollection.push(_coreUtil.merge(term, { childCollection: [] }));
                          } else {
                            resultChildTermCollection.push(_coreUtil.merge(term, { parent: currentTermTax.parent }));
                          }
                        });

                        resultChildTermCollection.map(function (childTerm) {
                          resultTermCollection = pushChildToTermInCollection(childTerm.parent, resultTermCollection, childTerm);
                        });

                        termCb(error, resultTermCollection);
                      })();
                    } else {
                      termCb(error, termCollection);
                    }
                  }
                });
              } else {
                termCb(err, collection);
              }
            };

            getTermDetail(function (errTerm, detailCollection) {
              cb(errTerm, _assemblers2['default'].category.detailCollection(collection, detailCollection), next);
            });
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