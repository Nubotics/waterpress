//util
'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

//methods

//general crud
var assemblePostMeta = function assemblePostMeta(post) {
  if (_coreUtil.has(post, 'metaCollection')) {
    post.metaObj = _coreUtil.makeObjectFromKeyCollection(post.metaCollection);
    return post;
  } else {
    return post;
  }
};

var updatePostInPostCollection = function updatePostInPostCollection(termTaxId, postCollection, updatedPost) {
  var newPostCollection = postCollection.map(function (post) {
    if (_coreUtil.has(post, 'relationshipCollection')) {
      var currTermTax = _coreUtil._.find(post.relationshipCollection, { termTaxonomy: termTaxId });
      if (currTermTax) {
        post = _coreUtil.merge(post, updatedPost);
        return post;
      } else {
        return post;
      }
    } else {
      return post;
    }
  });
  return newPostCollection;
};
var populatePostCollection = function populatePostCollection(e, postCollection, cb, next) {
  var _this = this;

  if (_coreUtil._.isArray(postCollection)) {
    (function () {
      var termTaxIdCollection = [];
      postCollection.map(function (post) {
        post = assemblePostMeta(post);
        post.categoryCollection = [];
        post.formatCollection = [];
        post.format = { name: 'standard', slug: 'standard', id: 0 };
        if (_coreUtil.has(post, 'relationshipCollection')) {
          if (_coreUtil._.isArray(post.relationshipCollection)) {
            if (post.relationshipCollection.length > 0) {
              post.relationshipCollection.map(function (relationship) {
                termTaxIdCollection.push(relationship.termTaxonomy);
              });
            }
          }
        }
        if (_coreUtil.has(post, 'author')) {
          delete post.author.password;
        }
      });
      if (termTaxIdCollection.length > 0) {
        _this.collections.termtaxonomy.find().where({ id: termTaxIdCollection }).populate('term')
        //.populate('relationshipCollection')
        .exec(function (err, collection) {
          if (err) {
            cb(err, postCollection, next);
          } else {
            if (_coreUtil._.isArray(collection)) {
              collection.map(function (termTax) {
                var postUpdate = {
                  categoryCollection: [],
                  formatCollection: [],
                  format: { name: 'standard', slug: 'standard', id: 0 }
                };
                if (termTax.taxonomy == 'category') {
                  postUpdate.categoryCollection.push(termTax.term);
                } else if (_coreUtil._.endsWith(termTax.taxonomy, '_format')) {
                  postUpdate.formatCollection.push(termTax.term);
                  postUpdate.format = termTax.term;
                }
                postCollection = updatePostInPostCollection(termTax.id, postCollection, postUpdate);
              });

              cb(err, postCollection, next);
            } else {
              cb(err, post, next);
            }
          }
        });
      } else {
        cb(e, postCollection, next);
      }
    })();
  }
};
var find = function find(params, options, cb, next) {
  var _this2 = this;

  if (this.collections) {
    if (!_coreUtil.has(params, 'postType')) {
      params = _coreUtil.assign(params, { postType: 'post' });
    }
    if (!_coreUtil.has(params, 'status')) {
      params = _coreUtil.assign(params, { status: ['publish', 'inherit'] });
    }
    var query = this.collections.post.find().where(params);

    if (_coreUtil.has(options, 'limit')) {
      query.limit(options.limit);
    }

    if (_coreUtil.has(options, 'skip')) {
      query.skip(options.skip);
    }

    if (_coreUtil.has(options, 'sort')) {
      query.sort(options.sort);
    }

    query.populate('author').populate('metaCollection').populate('relationshipCollection');

    if (_coreUtil.has(options, 'includeChildCollection')) {
      if (options.includeChildCollection) {
        query.populate('childCollection');
      }
    }

    query.exec(function (e, postCollection) {
      populatePostCollection.call(_this2, e, postCollection, cb, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};
var older = function older(lastId, limit, cb, next) {
  if (this.collections) {
    var params = { id: { '<': lastId } };
    var options = { sort: 'id ASC', limit: limit };
    find.call(this, params, options, cb, next);
  } else {
    cb('Not connected', null, next);
  }
};
var newer = function newer(firstId, limit, cb, next) {
  if (this.collections) {
    var params = { id: { '>': firstId } };
    var options = { sort: 'id DESC', limit: limit };
    find.call(this, params, options, cb, next);
  } else {
    cb('Not connected', null, next);
  }
};

var populatePost = function populatePost(e, post, cb, next) {
  var _this3 = this;

  post = assemblePostMeta(post);
  post.categoryCollection = [];
  post.formatCollection = [];
  post.format = { name: 'standard', slug: 'standard', id: 0 };
  var termTaxIdCollection = [];
  if (_coreUtil.has(post, 'relationshipCollection')) {
    if (_coreUtil._.isArray(post.relationshipCollection)) {
      if (post.relationshipCollection.length > 0) {
        post.relationshipCollection.map(function (relationship) {
          termTaxIdCollection.push(relationship.termTaxonomy);
        });
      }
    }
  }

  var populateUserMeta = function populateUserMeta(callback) {
    _this3.collections.usermeta.find().where({ user: post.author.id }).exec(function (errUserMeta, metaCollection) {
      if (errUserMeta) {
        callback(errUserMeta, null, null);
      } else {
        var metaObj = _coreUtil.makeObjectFromKeyCollection(metaCollection);
        callback(errUserMeta, metaCollection, metaObj);
      }
    });
  };
  var actionCb = function actionCb(err, post, next) {
    if (_coreUtil.has(post, 'author')) {
      delete post.author.password;
      populateUserMeta(function (metaErr, metaCollection, metaObj) {
        if (metaErr) {
          cb(metaErr, post, next);
        } else {
          post.author.metaCollection = metaCollection;
          post.author.metaObj = metaObj;
          cb(err, post, next);
        }
      });
    } else {
      cb(err, post, next);
    }
  };
  if (termTaxIdCollection.length > 0) {
    this.collections.termtaxonomy.find().where({ id: termTaxIdCollection }).populate('term').exec(function (err, collection) {
      if (err) {
        cb(err, post, next);
      } else {
        if (_coreUtil._.isArray(collection)) {
          collection.map(function (termTax) {
            if (termTax.taxonomy == 'category') {
              post.categoryCollection.push(termTax.term);
            } else if (_coreUtil._.endsWith(termTax.taxonomy, '_format')) {
              post.formatCollection.push(termTax.term);
              post.format = termTax.term;
            }
          });
          actionCb(err, post, next);
        } else {
          actionCb(err, post, next);
        }
      }
    });
  } else {
    cb(e, post, next);
  }
};
var one = function one(params, cb, next) {
  var _this4 = this;

  if (this.collections) {
    if (!_coreUtil.has(params, 'postType')) {
      params = _coreUtil.assign(params, { postType: 'post' });
    }
    if (!_coreUtil.has(params, 'status')) {
      params = _coreUtil.assign(params, { status: ['publish', 'inherit'] });
    }
    this.collections.post.findOne().where(params).populate('author').populate('relationshipCollection').populate('metaCollection').exec(function (e, post) {
      if (e) {
        cb(e, post, next);
      } else {
        populatePost.call(_this4, e, post, cb, next);
      }
    });
  } else {
    cb('Not connected', null, next);
  }
};
//TODO: save
var save = function save(postObj, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};
//TODO: kill
var kill = function kill(postId, cb, next) {
  if (this.collections) {
    cb(null, null, next);
  } else {
    cb('Not connected', null, next);
  }
};

//help crud
var findChildren = function findChildren(postId, cb, next) {
  if (this.collections) {
    var params = { parent: postId };
    var options = { sort: 'id DESC' };
    find.call(this, params, options, cb, next);
  } else {
    cb('Not connected', null, next);
  }
};
var findByFormat = function findByFormat(format, options, cb, next) {
  var _this5 = this;

  if (this.collections) {
    var params = { taxonomy: { 'endsWith': '_format' } };
    this.collections.termtaxonomy.find().where(params).populate('term').populate('relationshipCollection').exec(function (e, termTaxCollection) {
      var filterResult = [];
      _coreUtil._.map(termTaxCollection, function (termTax) {
        if (_coreUtil._.contains(termTax.term.slug, format) || _coreUtil._.contains(termTax.term.name, format)) {
          filterResult.push(termTax);
        }
      });
      var postIdCollection = [];
      if (filterResult.length > 0) {
        _coreUtil._.map(filterResult, function (filterTermTax) {
          if (_coreUtil.has(filterTermTax, 'relationshipCollection')) {
            _coreUtil._.map(filterTermTax.relationshipCollection, function (relation) {
              postIdCollection.push(relation.object);
            });
          }
        });
        if (postIdCollection.length > 0) {
          find.call(_this5, { id: postIdCollection }, options, cb, next);
        } else {
          cb(e, [], next);
        }
      } else {
        cb(e, [], next);
      }
    });
  } else {
    cb('Not connected', null, next);
  }
};
var findByCategory = function findByCategory(category, options, cb, next) {
  var _this6 = this;

  if (this.collections) {
    var params = { taxonomy: 'category' };
    this.collections.termtaxonomy.find().where(params).populate('term').populate('relationshipCollection').exec(function (e, termTaxCollection) {
      var filterResult = [];
      _coreUtil._.map(termTaxCollection, function (termTax) {
        if (_coreUtil._.contains(termTax.term.slug, category) || _coreUtil._.contains(termTax.term.name, category)) {
          filterResult.push(termTax);
        }
      });
      var postIdCollection = [];
      if (filterResult.length > 0) {
        _coreUtil._.map(filterResult, function (filterTermTax) {
          if (_coreUtil.has(filterTermTax, 'relationshipCollection')) {
            _coreUtil._.map(filterTermTax.relationshipCollection, function (relation) {
              postIdCollection.push(relation.object);
            });
          }
        });
        if (postIdCollection.length > 0) {
          find.call(_this6, { id: postIdCollection }, options, cb, next);
        } else {
          cb(e, [], next);
        }
      } else {
        cb(e, [], next);
      }
    });
  } else {
    cb('Not connected', null, next);
  }
};

//api export
exports['default'] = {
  find: find,
  older: older,
  newer: newer,
  one: one,
  save: save,
  kill: kill,
  findChildren: findChildren,
  findByFormat: findByFormat,
  findByCategory: findByCategory

};
module.exports = exports['default'];
//cb(null, null, next)