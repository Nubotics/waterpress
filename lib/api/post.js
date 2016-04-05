'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _util = require('../core/util');

var _addons = require('../addons');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } //util


//methods
var makeExcerpt = function makeExcerpt(content) {
  var result = (0, _addons.striptags)(content);
  result = (0, _addons.truncate)(result, 140);
  return result;
};
//general crud
var assemblePostMeta = function assemblePostMeta(post) {
  if ((0, _util.has)(post, 'metaCollection')) {
    post.metaObj = (0, _util.makeObject)(post.metaCollection);
    return post;
  } else {
    return post;
  }
};

var updatePostInPostCollection = function updatePostInPostCollection(termTaxId, postCollection, updatedPost) {
  var newPostCollection = postCollection.map(function (post) {
    if ((0, _util.has)(post, 'relationshipCollection')) {
      var currTermTax = (0, _util.find)(post.relationshipCollection, { termTaxonomy: termTaxId });
      if (currTermTax) {
        post = (0, _util.merge)(post, updatedPost);
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

  if ((0, _util.is)(postCollection, 'array')) {
    (function () {
      var termTaxIdCollection = [];
      postCollection.map(function (post) {
        post = assemblePostMeta(post);
        post.categoryCollection = [];
        post.formatCollection = [];
        post.format = { name: 'standard', slug: 'standard', id: 0 };
        if ((0, _util.has)(post, 'relationshipCollection')) {
          if ((0, _util.is)(post.relationshipCollection, 'array')) {
            if (post.relationshipCollection.length > 0) {
              post.relationshipCollection.map(function (relationship) {
                termTaxIdCollection.push(relationship.termTaxonomy);
              });
            }
          }
        }
        if ((0, _util.has)(post, 'author')) {
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
            if ((0, _util.is)(collection, 'array')) {
              collection.map(function (termTax) {
                var postUpdate = {
                  categoryCollection: [],
                  formatCollection: [],
                  format: { name: 'standard', slug: 'standard', id: 0 }
                };
                if (termTax.taxonomy == 'category') {
                  postUpdate.categoryCollection.push(termTax.term);
                } else if ((0, _util.endsWith)(termTax.taxonomy, '_format')) {
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
var findPost = function findPost(params, options, cb, next) {
  var _this2 = this;

  if (this.collections) {
    var queryParams = {};
    if (!(0, _util.has)(params, 'postType')) {
      queryParams = (0, _util.assign)(params, { postType: 'post' });
    }
    if (!(0, _util.has)(params, 'status')) {
      queryParams = (0, _util.assign)(params, { status: ['publish', 'inherit'] });
    } else if (params.status === 'all') {
      var status = params.status;

      var other = _objectWithoutProperties(params, ['status']);

      queryParams = _extends({}, other);
    }

    var query = this.collections.post.find().where(queryParams);

    if ((0, _util.has)(options, 'limit')) {
      query.limit(options.limit);
    }

    if ((0, _util.has)(options, 'skip')) {
      query.skip(options.skip);
    }

    if ((0, _util.has)(options, 'sort')) {
      query.sort(options.sort);
    }

    query.populate('author').populate('metaCollection').populate('relationshipCollection');

    if ((0, _util.has)(options, 'includeChildCollection')) {
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
    findPost.call(this, params, options, cb, next);
    //cb(null, null, next)
  } else {
      cb('Not connected', null, next);
    }
};
var newer = function newer(firstId, limit, cb, next) {
  if (this.collections) {
    var params = { id: { '>': firstId } };
    var options = { sort: 'id DESC', limit: limit };
    findPost.call(this, params, options, cb, next);
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
  if ((0, _util.has)(post, 'relationshipCollection')) {
    if ((0, _util.is)(post.relationshipCollection, 'array')) {
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
        var metaObj = (0, _util.makeObject)(metaCollection);
        callback(errUserMeta, metaCollection, metaObj);
      }
    });
  };
  var actionCb = function actionCb(err, post, next) {
    if ((0, _util.has)(post, 'author')) {
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
        if ((0, _util.is)(collection, 'array')) {
          collection.map(function (termTax) {
            if (termTax.taxonomy == 'category') {
              post.categoryCollection.push(termTax.term);
            } else if ((0, _util.endsWith)(termTax.taxonomy, '_format')) {
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
    actionCb(e, post, next);
  }
};
var one = function one(params, cb, next) {
  var _this4 = this;

  if (this.collections) {
    var query = _extends({}, params);
    if (!(0, _util.has)(params, 'postType')) {
      query = (0, _util.assign)(params, { postType: 'post' });
    }
    if (!(0, _util.has)(params, 'status')) {
      query = (0, _util.assign)(params, { status: ['publish', 'inherit'] });
    } else if (params.status === 'all') {
      var status = params.status;

      var other = _objectWithoutProperties(params, ['status']);

      query = _extends({}, other);
    }
    this.collections.post.findOne().where(query).populate('author').populate('metaCollection').populate('relationshipCollection').exec(function (e, post) {
      if (e) {
        cb(e, post, next);
      } else {
        populatePost.call(_this4, e, post || {}, cb, next);
      }
    });
  } else {
    cb('Not connected', null, next);
  }
};

var savePostCategory = function savePostCategory(_ref, cb, next) {
  var id = _ref.id;
  var categoryId = _ref.categoryId;
  var termId = _ref.termId;
  var taxonomyId = _ref.taxonomyId;
  var taxId = _ref.taxId;

  var _this5 = this;

  if (this.collections) {
    if (!(0, _util.is)(id, 'int')) {
      cb('No post identifier found', null, next);
    } else if (!(0, _util.is)(categoryId, 'int') && !(0, _util.is)(termId, 'int')) {
      cb('No category identifier found', null, next);
    } else {
      (function () {
        if (!(0, _util.is)(categoryId, 'int')) {
          if ((0, _util.is)(termId, 'int')) {
            categoryId = termId;
          }
        }
        if (!(0, _util.is)(taxId, 'int')) {
          if ((0, _util.is)(taxonomyId, 'int')) {
            taxId = taxonomyId;
          }
        }
        var createRelation = function createRelation(query, createCb) {
          _this5.collections.termrelationship.query('\n          INSERT INTO wp_term_relationships\n          (object_id, term_taxonomy_id, term_order)\n          VALUES (' + query.object + ', ' + query.termTaxonomy + ', 0);\n          ', createCb);
        };
        var findRelation = function findRelation(query, relCb) {
          _this5.collections.termrelationship.query('\n          SELECT * FROM wp_term_relationships\n          WHERE object_id = ' + query.object + ' AND term_taxonomy_id=' + query.termTaxonomy + ';\n          ', relCb);
        };
        var findTaxId = function findTaxId(taxCb) {
          _this5.collections.termtaxonomy.findOne().where({ term: categoryId, taxonomy: 'category' }).exec(taxCb);
        };
        var findOrCreate = function findOrCreate() {
          var taxQuery = {
            object: id,
            termTaxonomy: taxId
          };
          //-> if -> id + taxId -> exists -> cb
          //-> else -> create
          findRelation(taxQuery, function (err, relation) {
            if (err) {
              cb(err, null, next);
            } else if ((0, _util.is)(relation, 'nothing')) {
              createRelation(taxQuery, function (error, result) {
                cb(error, result, next);
              });
            } else if ((0, _util.is)(relation, 'array') && (0, _util.is)(relation, 'zero')) {
              createRelation(taxQuery, function (error, result) {
                cb(error, result, next);
              });
            } else {
              cb(null, relation, next);
            }
          });
        };
        //-> if -> taxid -> useless -> find -> create
        //-> else -> create

        console.log('TAX ID -> ', taxId);
        if ((0, _util.is)(taxId, 'nothing')) {

          findTaxId(function (err, tax) {
            if (err || (0, _util.is)(tax, 'nothing')) {
              cb(err, tax, next);
            } else {

              console.log('TAX -> ', tax);

              taxId = tax.id;

              findOrCreate();
            }
          });
        } else {
          findOrCreate();
        }
      })();
    }
  } else {
    cb('Not connected', null, next);
  }
};
var savePostCategoryCollection = function savePostCategoryCollection(_ref2, cb, next) {
  var id = _ref2.id;
  var categoryCollection = _ref2.categoryCollection;

  var _this6 = this;

  if (this.collections) {
    if (!(0, _util.is)(id, 'int')) {
      cb('No post identifier found', null, next);
    } else {
      (function () {
        var findTaxByTermIds = [];
        var saveCollection = [];
        var findTaxIds = function findTaxIds(taxCb) {
          _this6.collections.termtaxonomy.findOne().where({ term: findTaxByTermIds, taxonomy: 'category' }).exec(taxCb);
        };

        var createRelations = function createRelations(query, createCb) {
          //TODO: create category collection
        };
        var assembleRelations = function assembleRelations(collection) {
          var result = [];
          (0, _util.forEach)(collection, function (item) {
            result.push({
              object: id,
              termTaxonomy: item.taxonomyId
            });
          });
          return result;
        };
        (0, _util.forEach)(categoryCollection, function (category) {
          if (!(0, _util.has)(category, 'id')) {
            if ((0, _util.has)(category, 'taxonomyId') || (0, _util.has)(category, 'taxId')) {
              saveCollection.push(category);
            } else {
              findTaxByTermIds.push(category.id);
            }
          } else {
            findTaxByTermIds.push(category.id);
          }
        });
        if ((0, _util.is)(findTaxByTermIds, 'zero')) {
          createRelations(assembleRelations(saveCollection), function (err, collection) {
            cb(err, collection, next);
          });
        } else {
          findTaxIds(function (err, taxCollection) {
            var taxIds = (0, _util.pluck)(taxCollection, 'id');
            (0, _util.forEach)(taxIds, function (taxonomyId) {
              saveCollection.push({
                object: id,
                termTaxonomy: taxonomyId
              });
            });
            createRelations(assembleRelations(saveCollection), function (err, collection) {
              cb(err, collection, next);
            });
          });
        }
      })();
    }
  } else {
    cb('Not connected', null, next);
  }
};

var savePostMetaItem = function savePostMetaItem(metaItem, cb, next) {
  var _this7 = this;

  if (this.collections) {
    (function () {
      var id = metaItem.id;
      var post = metaItem.post;

      var updateAction = function updateAction() {
        _this7.collections.postmeta.update({ id: id }, metaItem).exec(function (e, collection) {
          var resultItem = undefined;
          if ((0, _util.is)(collection, 'array')) {
            if (collection.length > 0) {
              resultItem = collection[0];
            }
          }
          cb(e, resultItem, next);
        });
      };
      var createAction = function createAction() {
        _this7.collections.postmeta.create(metaItem).exec(function (e, newItem) {
          cb(e, newItem, next);
        });
      };
      if (!post) {
        cb('No post identifier found', null, next);
      } else if (id) {
        updateAction();
      } else {
        createAction();
      }
    })();
  } else {
    cb('Not connected', null, next);
  }
};
var savePostMetaCollection = function savePostMetaCollection(_ref3, cb, next) {
  var id = _ref3.id;
  var metaCollection = _ref3.metaCollection;

  var _this8 = this;

  if (this.collections) {
    if (!(0, _util.is)(id, 'int')) {
      cb('No post identifier found', null, next);
    } else {
      (function () {
        var createCollection = [];
        var updateCollection = [];
        var createAction = function createAction(createCb) {
          if ((0, _util.is)(createCollection, 'zero')) {
            createCb(null, null);
          } else {
            _this8.collections.postmeta.create(createCollection).exec(createCb);
          }
        };
        var findPostMeta = function findPostMeta(metaCb) {
          findMeta.call(_this8, id, function (err, collection) {
            metaCb(err, collection);
          });
        };
        var updateAction = function updateAction(updateCb) {
          if ((0, _util.is)(updateCollection, 'zero')) {
            updateCb(null, null);
          } else {
            findPostMeta(function (err, collection) {
              var currIndex = -1;
              var queryCollection = (0, _util.map)(collection, function (item) {
                currIndex = (0, _util.findIndex)(updateCollection, { id: item.id });
                if (currIndex > -1) {
                  return updateCollection[currIndex];
                } else {
                  return item;
                }
              });

              _this8.collections.post.update({ id: id }, { id: id, metaCollection: queryCollection }).exec(updateCb);
            });
          }
        };
        var refreshPost = function refreshPost(postCb) {
          one.call(_this8, { id: id }, function (err, post) {
            postCb(err, post);
          });
        };
        (0, _util.forEach)(metaCollection, function (item) {
          if ((0, _util.has)(item, 'id')) {
            if ((0, _util.is)(item.id, 'int') && item.id > 0) {
              updateCollection.push(item);
            } else {
              createCollection.push(item);
            }
          } else {
            createCollection.push(item);
          }
        });
        createAction(function (e) {
          if (e) {
            cb(e, null, next);
          } else {
            updateAction(function (err) {
              if (err) {
                cb(err, null, next);
              } else {
                refreshPost(function (error, post) {
                  cb(err, post, next);
                });
              }
            });
          }
        });
      })();
    }
  } else {
    cb('Not connected', null, next);
  }
};
var save = function save(postObj, callback, next) {
  var _this9 = this;

  if (this.collections) {
    //-> !has -> author -> error
    if (!(0, _util.has)(postObj, 'author')) {
      callback('No author supplied', null, next);
    } else if (!(0, _util.is)(postObj.author, 'int')) {
      callback('No valid author supplied', null, next);
    } else {
      (function () {

        //-> has -> id -> exists
        var shouldUpdate = function shouldUpdate() {
          return (0, _util.has)(postObj, 'id') && (0, _util.is)(postObj.id, 'int');
        };

        //:-> validate postObj
        var validatePost = function validatePost() {
          var query = _extends({}, postObj);
          //-> !has -> slug -> generate
          if (!(0, _util.has)(postObj, 'slug') || (0, _util.is)(postObj.slug, 'zero')) {
            if ((0, _util.has)(postObj, 'title') && !(0, _util.is)(postObj.title, 'zero')) {
              query.slug = (0, _addons.slugger)(postObj.title);
            }
          }
          //-> !has -> postType -> default
          if (!(0, _util.has)(postObj, 'postType') || (0, _util.is)(postObj.postType, 'zero')) {
            query.postType = 'post';
          }
          //-> !has -> excerpt -> generate
          if (!(0, _util.has)(postObj, 'excerpt') || (0, _util.is)(postObj.excerpt, 'zero')) {
            if ((0, _util.has)(postObj, 'content')) {
              query.excerpt = makeExcerpt(postObj.content);
            }
          }
          //-> !has -> status -> default
          if (!(0, _util.has)(postObj, 'status') || (0, _util.is)(postObj.status, 'zero')) {
            query.status = 'draft';
          }
          //-> !has -> guid -> generate
          if (!(0, _util.has)(postObj, 'guid')) {
            //TODO: for attachment
          }

          var hasCategory = false;
          //-> !has -> relationshipCollection -> default
          if ((0, _util.has)(postObj, 'relationshipCollection') && !(0, _util.is)(postObj, 'zero')) {
            hasCategory = true;
          }

          return query;
        };

        //:-> check slug exists && slug belongs to author
        var findExistingPost = function findExistingPost(slug, author, cb) {
          _this9.collections.post.findOne().where({ slug: slug }).exec(function (err, post) {
            if (err) {
              cb(err, null);
            } else {
              if ((0, _util.has)(post, 'id')) {
                var id = post.id;
                var _author = post.author;
                var _slug = post.slug;

                var authorId = 0;
                if ((0, _util.has)(_author, 'id')) {
                  authorId = _author.id;
                } else {
                  authorId = _author;
                }
                cb(err, { exists: true, id: id, author: authorId, slug: _slug });
              } else {
                cb(err, { exists: false });
              }
            }
          });
        };

        //-> exists -> generate suffix
        var uniqueSlug = function uniqueSlug(slug) {
          return slug + '-' + (0, _util.generateUuid)().slice(0, 8);
        };

        //-> if -> slug && author exist || has -> postObj -> id
        //-> update
        var updatePost = function updatePost(updateParams, cb) {
          updateParams.updatedAt = new Date();
          _this9.collections.post.update({ id: updateParams.id }, updateParams).exec(function (err, updateCollection) {
            if (err) {
              cb(err, null);
            } else {
              var updatedPost = null;
              if (!(0, _util.is)(updateCollection, 'zero')) {
                updatedPost = updateCollection[0];
              }
              cb(err, updatedPost);
            }
          });
        };
        //-> else

        //:-> create
        var createPost = function createPost(createParams, cb) {
          findExistingPost(createParams.slug, createParams.author, function (err, _ref4) {
            var exists = _ref4.exists;

            var other = _objectWithoutProperties(_ref4, ['exists']);

            if (err) {
              cb(err, null);
            } else {
              if (exists) {
                createParams.slug = uniqueSlug(createParams.slug);
              }
              _this9.collections.post.create(createParams).exec(cb);
            }
          });
        };

        //:-> get populated post
        var reloadPost = function reloadPost(id, cb) {
          one.call(_this9, { id: id, status: 'all' }, function (err, post) {
            cb(err, post);
          });
        };

        //::-> run
        if (shouldUpdate()) {
          updatePost(postObj, function (err, post) {
            if (err) {
              callback(err, post, next);
            } else {
              if ((0, _util.has)(post, 'id')) {
                reloadPost(post.id, function (err, freshPost) {
                  callback(err, freshPost, next);
                });
              } else {
                callback(err, post, next);
              }
            }
          });
        } else {
          var query = validatePost();
          createPost(query, function (err, newPost) {
            if (err) {
              callback(err, newPost, next);
            } else {
              if ((0, _util.has)(newPost, 'id')) {
                reloadPost(newPost.id, function (err, reloadPost) {
                  callback(err, reloadPost, next);
                });
              } else {
                callback(err, newPost, next);
              }
            }
          });
        }
      })();
    }
  } else {
    callback('Not connected', null, next);
  }
};

var kill = function kill(postId, cb, next) {
  if (this.collections) {
    this.collections.post.destroy({ id: postId }).exec(function (err, result) {
      cb(err, result, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};

//help crud
var findChildren = function findChildren(postId, cb, next) {
  if (this.collections) {
    var params = { parent: postId };
    var options = { sort: 'id DESC' };
    findPost.call(this, params, options, cb, next);
  } else {
    cb('Not connected', null, next);
  }
};
var findByFormat = function findByFormat(format, options, cb, next) {
  var _this10 = this;

  if (this.collections) {
    (function () {
      var params = { taxonomy: { 'endsWith': '_format' } };

      var findRelation = function findRelation(taxIds, relCb) {
        _this10.collections.termrelationship.query('\n          SELECT * FROM wp_term_relationships\n          WHERE term_taxonomy_id in (' + taxIds.toString() + ');\n          ', relCb);
      };

      _this10.collections.termtaxonomy.find().where(params).populate('term')
      //.populate('relationshipCollection')
      .exec(function (e, termTaxCollection) {
        var filterResult = [];
        var termIds = [];
        (0, _util.map)(termTaxCollection, function (termTax) {
          if ((0, _util.includes)(termTax.term.slug, category) || (0, _util.includes)(termTax.term.name, category)) {
            filterResult.push(termTax);
            termIds.push(termTax.id);
          }
        });

        if (filterResult.length > 0) {

          findRelation(termIds, function (err, relations) {

            var postIdCollection = (0, _util.pluck)(relations, 'object_id');

            if (postIdCollection.length > 0) {
              findPost.call(_this10, { id: postIdCollection }, options, cb, next);
            } else {
              cb(e, [], next);
            }
          });
        } else {
          cb(e, [], next);
        }
      });
    })();
  } else {
    cb('Not connected', null, next);
  }
};
var findByCategory = function findByCategory(category, options, cb, next) {
  var _this11 = this;

  if (this.collections) {
    (function () {
      var params = { taxonomy: 'category' };

      var findRelation = function findRelation(taxIds, relCb) {
        _this11.collections.termrelationship.query('\n          SELECT * FROM wp_term_relationships\n          WHERE term_taxonomy_id in (' + taxIds.toString() + ');\n          ', relCb);
      };

      _this11.collections.termtaxonomy.find().where(params).populate('term')
      //.populate('relationshipCollection')
      .exec(function (e, termTaxCollection) {
        var filterResult = [];
        var termIds = [];
        (0, _util.map)(termTaxCollection, function (termTax) {
          if ((0, _util.includes)(termTax.term.slug, category) || (0, _util.includes)(termTax.term.name, category)) {
            filterResult.push(termTax);
            termIds.push(termTax.id);
          }
        });

        if (filterResult.length > 0) {

          findRelation(termIds, function (err, relations) {

            var postIdCollection = (0, _util.pluck)(relations, 'object_id');

            if (postIdCollection.length > 0) {
              findPost.call(_this11, { id: postIdCollection }, options, cb, next);
            } else {
              cb(e, [], next);
            }
          });
        } else {
          cb(e, [], next);
        }
      });
    })();
  } else {
    cb('Not connected', null, next);
  }
};
var findMeta = function findMeta(postId, cb, next) {
  if (this.collections) {
    this.collections.postmeta.find().where({ post: postId }).exec(function (err, collection) {
      cb(err, collection, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};

//api export
exports.default = {
  find: findPost,
  older: older,
  newer: newer,
  one: one,
  save: save,
  savePostCategory: savePostCategory,
  savePostCategoryCollection: savePostCategoryCollection,
  savePostMetaItem: savePostMetaItem,
  savePostMetaCollection: savePostMetaCollection,
  kill: kill,
  findChildren: findChildren,
  findByFormat: findByFormat,
  findByCategory: findByCategory,
  findMeta: findMeta
};
module.exports = exports['default'];