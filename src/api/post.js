//util
import {
  includes,
  map,
  endsWith,
  find,
  findIndex,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  is,
  makeObject,
  merge,
  generateUuid,
  pluck,
  uniq,
} from '../core/util'

import {
  striptags,
  truncate,
  slugger,
} from '../addons'

//methods
const makeExcerpt = function (content) {
  let result = striptags(content)
  result = truncate(result, 140)
  return result
}
//general crud
let assemblePostMeta = function (post) {
  if (has(post, 'metaCollection')) {
    post.metaObj = makeObject(post.metaCollection)
    return post
  } else {
    return post
  }
}

let updatePostInPostCollection = function (termTaxId, postCollection, updatedPost) {
  let newPostCollection = postCollection.map(post=> {
    if (has(post, 'relationshipCollection')) {
      let currTermTax = find(post.relationshipCollection, {termTaxonomy: termTaxId})
      if (currTermTax) {
        post = merge(post, updatedPost)
        return post
      } else {
        return post
      }
    } else {
      return post
    }
  })
  return newPostCollection
}
let populatePostCollection = function (e, postCollection, cb, next) {
  if (is(postCollection, 'array')) {
    let termTaxIdCollection = []
    postCollection.map(post=> {
      post = assemblePostMeta(post)
      post.categoryCollection = []
      post.formatCollection = []
      post.format = {name: 'standard', slug: 'standard', id: 0}
      if (has(post, 'relationshipCollection')) {
        if (is(post.relationshipCollection, 'array')) {
          if (post.relationshipCollection.length > 0) {
            post.relationshipCollection.map(relationship=> {
              termTaxIdCollection.push(relationship.termTaxonomy)
            })
          }
        }
      }
      if (has(post, 'author.password')) {
        delete post.author.password
      }
    })
    if (termTaxIdCollection.length > 0) {
      this.collections
        .termtaxonomy
        .find()
        .where({id: termTaxIdCollection})
        .populate('term')
        //.populate('relationshipCollection')
        .exec((err, collection)=> {
          if (err) {
            cb(err, postCollection, next)
          } else {
            if (is(collection, 'array')) {
              collection.map(termTax=> {
                let postUpdate = {
                  categoryCollection: [],
                  formatCollection: [],
                  format: {name: 'standard', slug: 'standard', id: 0},
                }
                if (termTax.taxonomy == 'category') {
                  postUpdate.categoryCollection.push(termTax.term)
                } else if (endsWith(termTax.taxonomy, '_format')) {
                  postUpdate.formatCollection.push(termTax.term)
                  postUpdate.format = termTax.term
                }
                postCollection = updatePostInPostCollection(termTax.id, postCollection, postUpdate)
              })

              cb(err, postCollection, next)
            } else {
              cb(err, post, next)
            }
          }

        })
    } else {
      cb(e, postCollection, next)
    }
  }
}
let findPost = function (params, options, cb, next) {
  if (this.collections) {
    let queryParams = {}
    if (!has(params, 'postType')) {
      queryParams = assign(params, {postType: 'post'})
    }
    if (!has(params, 'status')) {
      queryParams = assign(params, {status: ['publish', 'inherit']})
    } else if (params.status === 'all') {
      let {status, ...other} = params
      queryParams = {...other}
    }

    let query =
      this.collections
        .post
        .find()
        .where(queryParams)

    if (has(options, 'limit')) {
      query.limit(options.limit)
    }

    if (has(options, 'skip')) {
      query.skip(options.skip)
    }

    if (has(options, 'sort')) {
      query.sort(options.sort)
    }

    query
      .populate('author')
      .populate('metaCollection')
      .populate('relationshipCollection')

    if (has(options, 'includeChildCollection')) {
      if (options.includeChildCollection) {
        query.populate('childCollection')
      }
    }

    query
      .exec((e, postCollection)=> {
        populatePostCollection.call(this, e, postCollection, cb, next)
      })


  } else {
    cb('Not connected', null, next)
  }
}
let older = function (lastId, limit, cb, next) {
  if (this.collections) {
    let params = {id: {'<': lastId}}
    let options = {sort: 'id ASC', limit}
    findPost.call(this, params, options, cb, next)
    //cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}
let newer = function (firstId, limit, cb, next) {
  if (this.collections) {
    let params = {id: {'>': firstId}}
    let options = {sort: 'id DESC', limit}
    findPost.call(this, params, options, cb, next)
  } else {
    cb('Not connected', null, next)
  }
}

let populatePost = function (e, post, cb, next) {
  post = assemblePostMeta(post)
  post.categoryCollection = []
  post.formatCollection = []
  post.format = {name: 'standard', slug: 'standard', id: 0}
  let termTaxIdCollection = []
  if (has(post, 'relationshipCollection')) {
    if (is(post.relationshipCollection, 'array')) {
      if (post.relationshipCollection.length > 0) {
        post.relationshipCollection.map(relationship=> {
          termTaxIdCollection.push(relationship.termTaxonomy)
        })
      }
    }
  }

  let populateUserMeta = (callback)=> {
    this.collections
      .usermeta
      .find()
      .where({user: post.author.id})
      .exec((errUserMeta, metaCollection)=> {
        if (errUserMeta) {
          callback(errUserMeta, null, null)
        } else {
          let metaObj = makeObject(metaCollection)
          callback(errUserMeta, metaCollection, metaObj)
        }
      })
  }
  let actionCb = (err, post, next)=> {
    if (has(post, 'author')) {
      if (has(post, 'author.password')) {
        delete post.author.password
      }
      populateUserMeta((metaErr, metaCollection, metaObj)=> {
        if (metaErr) {
          cb(metaErr, post, next)
        } else {
          post.author.metaCollection = metaCollection
          post.author.metaObj = metaObj
          cb(err, post, next)
        }
      })
    } else {
      cb(err, post, next)
    }
  }
  if (termTaxIdCollection.length > 0) {
    this.collections
      .termtaxonomy
      .find()
      .where({id: termTaxIdCollection})
      .populate('term')
      .exec((err, collection)=> {
        if (err) {
          cb(err, post, next)
        } else {
          if (is(collection, 'array')) {
            collection.map(termTax=> {
              if (termTax.taxonomy == 'category') {
                post.categoryCollection.push(termTax.term)
              } else if (endsWith(termTax.taxonomy, '_format')) {
                post.formatCollection.push(termTax.term)
                post.format = termTax.term
              }
            })
            actionCb(err, post, next)
          } else {
            actionCb(err, post, next)
          }
        }

      })
  } else {
    actionCb(e, post, next)
  }
}
let one = function (params, cb, next) {
  if (this.collections) {
    let query = {...params}
    if (!has(params, 'postType')) {
      query = assign(params, {postType: 'post'})
    }
    if (!has(params, 'status')) {
      query = assign(params, {status: ['publish', 'inherit']})
    } else if (params.status === 'all') {
      let {status, ...other} = params
      query = {...other}
    }
    this.collections
      .post
      .findOne()
      .where(query)
      .populate('author')
      .populate('metaCollection')
      .populate('relationshipCollection')
      .exec((e, post)=> {
        if (e) {
          cb(e, post, next)
        } else {
          populatePost.call(this, e, post || {}, cb, next)
        }
      })
  } else {
    cb('Not connected', null, next)
  }
}

let savePostCategory = function ({id, categoryId, termId, taxonomyId, taxId}, cb, next) {
  if (this.collections) {
    if (!is(id, 'int')) {
      cb('No post identifier found', null, next)
    } else if (!is(categoryId, 'int') && !is(termId, 'int')) {
      cb('No category identifier found', null, next)
    } else {
      if (!is(categoryId, 'int')) {
        if (is(termId, 'int')) {
          categoryId = termId
        }
      }
      if (!is(taxId, 'int')) {
        if (is(taxonomyId, 'int')) {
          taxId = taxonomyId
        }
      }
      const createRelation = (query, createCb)=> {
        this.collections
          .termrelationship
          .query(
          `
          INSERT INTO wp_term_relationships
          (object_id, term_taxonomy_id, term_order)
          VALUES (${query.object}, ${query.termTaxonomy}, 0);
          `, createCb)
      }
      const findRelation = (query, relCb)=> {
        this.collections
          .termrelationship
          .query(
          `
          SELECT * FROM wp_term_relationships
          WHERE object_id = ${query.object} AND term_taxonomy_id=${query.termTaxonomy};
          `, relCb)
      }
      const findTaxId = taxCb=> {
        this.collections
          .termtaxonomy
          .findOne()
          .where({term: categoryId, taxonomy: 'category'})
          .exec(taxCb)
      }
      const findOrCreate = ()=> {
        let taxQuery = {
          object: id,
          termTaxonomy: taxId,
        }
        //-> if -> id + taxId -> exists -> cb
        //-> else -> create
        findRelation(taxQuery, (err, relation)=> {
          if (err) {
            cb(err, null, next)
          } else if (is(relation, 'nothing')) {
            createRelation(taxQuery, (error, result)=> {
              cb(error, result, next)
            })
          } else if (is(relation, 'array') && is(relation, 'zero')) {
            createRelation(taxQuery, (error, result)=> {
              cb(error, result, next)
            })
          } else {
            cb(null, relation, next)
          }
        })
      }
      //-> if -> taxid -> useless -> find -> create
      //-> else -> create

      console.log('TAX ID -> ', taxId)
      if (is(taxId, 'nothing')) {

        findTaxId((err, tax)=> {
          if (err || is(tax, 'nothing')) {
            cb(err, tax, next)
          } else {

            console.log('TAX -> ', tax)

            taxId = tax.id

            findOrCreate()
          }
        })
      } else {
        findOrCreate()
      }
    }
  } else {
    cb('Not connected', null, next)
  }
}
let savePostCategoryCollection = function ({id, categoryCollection}, cb, next) {
  if (this.collections) {
    if (!is(id, 'int')) {
      cb('No post identifier found', null, next)
    } else {
      let findTaxByTermIds = []
      let saveCollection = []
      const findTaxIds = taxCb=> {
        this.collections
          .termtaxonomy
          .findOne()
          .where({term: findTaxByTermIds, taxonomy: 'category'})
          .exec(taxCb)
      }

      const createRelations = (query, createCb)=> {
        //TODO: create category collection
      }
      const assembleRelations = collection=> {
        let result = []
        forEach(collection, item=> {
          result.push({
            object: id,
            termTaxonomy: item.taxonomyId,
          })
        })
        return result
      }
      forEach(categoryCollection, category=> {
        if (!has(category, 'id')) {
          if (has(category, 'taxonomyId') || has(category, 'taxId')) {
            saveCollection.push(category)
          } else {
            findTaxByTermIds.push(category.id)
          }
        } else {
          findTaxByTermIds.push(category.id)
        }
      })
      if (is(findTaxByTermIds, 'zero')) {
        createRelations(assembleRelations(saveCollection), (err, collection)=> {
          cb(err, collection, next)
        })
      } else {
        findTaxIds((err, taxCollection)=> {
          let taxIds = pluck(taxCollection, 'id')
          forEach(taxIds, taxonomyId=> {
            saveCollection.push({
              object: id,
              termTaxonomy: taxonomyId,
            })
          })
          createRelations(assembleRelations(saveCollection), (err, collection)=> {
            cb(err, collection, next)
          })
        })
      }
    }
  } else {
    cb('Not connected', null, next)
  }
}

let savePostMetaItem = function (metaItem, cb, next) {
  if (this.collections) {
    let {id, post} = metaItem
    const updateAction = ()=> {
      this.collections
        .postmeta
        .update({id}, metaItem)
        .exec((e, collection)=> {
          let resultItem = undefined
          if (is(collection, 'array')) {
            if (collection.length > 0) {
              resultItem = collection[0]
            }
          }
          cb(e, resultItem, next)
        })
    }
    const createAction = ()=> {
      this.collections
        .postmeta
        .create(metaItem)
        .exec((e, newItem)=> {
          cb(e, newItem, next)
        })
    }
    if (!post) {
      cb('No post identifier found', null, next)
    } else if (id) {
      updateAction()
    } else {
      createAction()
    }
  } else {
    cb('Not connected', null, next)
  }
}
let savePostMetaCollection = function ({ id, metaCollection }, cb, next) {
  if (this.collections) {
    if (!is(id, 'int')) {
      cb('No post identifier found', null, next)
    } else {
      let createCollection = []
      let updateCollection = []
      const createAction = (createCb)=> {
        if (is(createCollection, 'zero')) {
          createCb(null, null)
        } else {
          this.collections
            .postmeta
            .create(createCollection)
            .exec(createCb)
        }
      }
      const findPostMeta = metaCb=> {
        findMeta.call(this, id, function (err, collection) {
          metaCb(err, collection)
        })
      }
      const updateAction = (updateCb)=> {
        if (is(updateCollection, 'zero')) {
          updateCb(null, null)
        } else {
          findPostMeta((err, collection)=> {
            let currIndex = -1
            let queryCollection = map(collection, item=> {
              currIndex = findIndex(updateCollection, {id: item.id})
              if (currIndex > -1) {
                return updateCollection[currIndex]
              } else {
                return item
              }
            })

            this.collections
              .post
              .update({id}, {id, metaCollection: queryCollection})
              .exec(updateCb)
          })

        }

      }
      const refreshPost = (postCb)=> {
        one.call(this, {id}, function (err, post) {
          postCb(err, post)
        })
      }
      forEach(metaCollection, item=> {
        if (has(item, 'id')) {
          if (is(item.id, 'int') && item.id > 0) {
            updateCollection.push(item)
          } else {
            createCollection.push(item)
          }
        } else {
          createCollection.push(item)
        }
      })
      createAction(e=> {
        if (e) {
          cb(e, null, next)
        } else {
          updateAction(err=> {
            if (err) {
              cb(err, null, next)
            } else {
              refreshPost((error, post)=> {
                cb(err, post, next)
              })
            }
          })
        }
      })
    }
  } else {
    cb('Not connected', null, next)
  }
}
let save = function (postObj, callback, next) {
  if (this.collections) {
    //-> !has -> author -> error
    if (!has(postObj, 'author')) {
      callback('No author supplied', null, next)
    } else if (!is(postObj.author, 'int')) {
      callback('No valid author supplied', null, next)
    } else {

      //-> has -> id -> exists
      const shouldUpdate = ()=> {
        return has(postObj, 'id') && is(postObj.id, 'int')
      }

      //:-> validate postObj
      const validatePost = ()=> {
        let query = {...postObj}
        //-> !has -> slug -> generate
        if (!has(postObj, 'slug') || is(postObj.slug, 'zero')) {
          if (has(postObj, 'title') && !is(postObj.title, 'zero')) {
            query.slug = slugger(postObj.title)
          }
        }
        //-> !has -> postType -> default
        if (!has(postObj, 'postType') || is(postObj.postType, 'zero')) {
          query.postType = 'post'
        }
        //-> !has -> excerpt -> generate
        if (!has(postObj, 'excerpt') || is(postObj.excerpt, 'zero')) {
          if (has(postObj, 'content')) {
            query.excerpt = makeExcerpt(postObj.content)
          }
        }
        //-> !has -> status -> default
        if (!has(postObj, 'status') || is(postObj.status, 'zero')) {
          query.status = 'draft'
        }
        //-> !has -> guid -> generate
        if (!has(postObj, 'guid')) {
          //TODO: for attachment
        }


        let hasCategory = false
        //-> !has -> relationshipCollection -> default
        if (has(postObj, 'relationshipCollection') && !is(postObj, 'zero')) {
          hasCategory = true
        }

        return query
      }

      //:-> check slug exists && slug belongs to author
      const findExistingPost = (slug, author, cb)=> {
        this.collections
          .post
          .findOne()
          .where({slug})
          .exec((err, post)=> {
            if (err) {
              cb(err, null)
            } else {
              if (has(post, 'id')) {
                let {id, author, slug} = post
                let authorId = 0
                if (has(author, 'id')) {
                  authorId = author.id
                } else {
                  authorId = author
                }
                cb(err, {exists: true, id, author: authorId, slug})
              } else {
                cb(err, {exists: false})
              }
            }
          })
      }

      //-> exists -> generate suffix
      const uniqueSlug = (slug)=> {
        return `${slug}-${generateUuid().slice(0, 8)}`
      }

      //-> if -> slug && author exist || has -> postObj -> id
      //-> update
      const updatePost = (updateParams, cb)=> {
        updateParams.updatedAt = new Date()
        this.collections
          .post
          .update({id: updateParams.id}, updateParams)
          .exec((err, updateCollection)=> {
            if (err) {
              cb(err, null)
            } else {
              let updatedPost = null
              if (!is(updateCollection, 'zero')) {
                updatedPost = updateCollection[0]
              }
              cb(err, updatedPost)
            }
          })
      }
      //-> else

      //:-> create
      const createPost = (createParams, cb)=> {
        findExistingPost(
          createParams.slug,
          createParams.author,
          (err, {exists,...other})=> {
            if (err) {
              cb(err, null)
            } else {
              if (exists) {
                createParams.slug = uniqueSlug(createParams.slug)
              }
              this.collections
                .post
                .create(createParams)
                .exec(cb)
            }
          })
      }

      //:-> get populated post
      const reloadPost = (id, cb)=> {
        one.call(this, {id, status: 'all'}, function (err, post) {
          cb(err, post)
        })
      }

      //::-> run
      if (shouldUpdate()) {
        updatePost(postObj, (err, post)=> {
          if (err) {
            callback(err, post, next)
          } else {
            if (has(post, 'id')) {
              reloadPost(post.id, (err, freshPost)=> {
                callback(err, freshPost, next)
              })
            } else {
              callback(err, post, next)
            }
          }
        })
      } else {
        let query = validatePost()
        createPost(query, (err, newPost)=> {
          if (err) {
            callback(err, newPost, next)
          } else {
            if (has(newPost, 'id')) {
              reloadPost(newPost.id, (err, reloadPost)=> {
                callback(err, reloadPost, next)
              })
            } else {
              callback(err, newPost, next)
            }
          }
        })
      }
    }
  } else {
    callback('Not connected', null, next)
  }
}

let kill = function (postId, cb, next) {
  if (this.collections) {
    this.collections
      .post
      .destroy({id: postId})
      .exec((err, result)=> {
        cb(err, result, next)
      })
  } else {
    cb('Not connected', null, next)
  }
}

//help crud
let findChildren = function (postId, cb, next) {
  if (this.collections) {
    let params = {parent: postId}
    let options = {sort: 'id DESC'}
    findPost.call(this, params, options, cb, next)
  } else {
    cb('Not connected', null, next)
  }
}
let findByFormat = function (format, options, cb, next) {
  if (this.collections) {
    let params = {taxonomy: {'endsWith': '_format'}}

    const findRelation = (taxIds, relCb)=> {
      this.collections
        .termrelationship
        .query(
        `
          SELECT * FROM wp_term_relationships
          WHERE term_taxonomy_id in (${taxIds.toString()});
          `, relCb)
    }

    this.collections
      .termtaxonomy
      .find()
      .where(params)
      .populate('term')
      //.populate('relationshipCollection')
      .exec((e, termTaxCollection)=> {
        let filterResult = []
        let termIds = []
        map(termTaxCollection, termTax=> {
          if (includes(termTax.term.slug, category)
            || includes(termTax.term.name, category)) {
            filterResult.push(termTax)
            termIds.push(termTax.id)
          }
        })

        if (filterResult.length > 0) {

          findRelation(termIds, (err, relations)=> {

            let postIdCollection = pluck(relations, 'object_id')

            if (postIdCollection.length > 0) {
              findPost.call(this, {id: postIdCollection}, options, cb, next)
            } else {
              cb(e, [], next)
            }

          })

        } else {
          cb(e, [], next)
        }

      })
  } else {
    cb('Not connected', null, next)
  }
}
let findByCategory = function (category, options, cb, next) {
  if (this.collections) {
    let params = {taxonomy: 'category'}

    const findRelation = (taxIds, relCb)=> {
      this.collections
        .termrelationship
        .query(
        `
          SELECT * FROM wp_term_relationships
          WHERE term_taxonomy_id in (${taxIds.toString()});
          `, relCb)
    }

    this.collections
      .termtaxonomy
      .find()
      .where(params)
      .populate('term')
      //.populate('relationshipCollection')
      .exec((e, termTaxCollection)=> {
        let filterResult = []
        let termIds = []
        map(termTaxCollection, termTax=> {
          if (includes(termTax.term.slug, category)
            || includes(termTax.term.name, category)) {
            filterResult.push(termTax)
            termIds.push(termTax.id)
          }
        })

        if (filterResult.length > 0) {

          findRelation(termIds, (err, relations)=> {

            let postIdCollection = pluck(relations, 'object_id')

            if (postIdCollection.length > 0) {
              findPost.call(this, {id: postIdCollection}, options, cb, next)
            } else {
              cb(e, [], next)
            }

          })

        } else {
          cb(e, [], next)
        }

      })
  } else {
    cb('Not connected', null, next)
  }
}
let findMeta = function (postId, cb, next) {
  if (this.collections) {
    this.collections
      .postmeta
      .find()
      .where({post: postId})
      .exec((err, collection)=> {
        cb(err, collection, next)
      })
  } else {
    cb('Not connected', null, next)
  }
}

//api export
export default {
  find: findPost,
  older,
  newer,
  one,
  save,
  savePostCategory,
  savePostCategoryCollection,
  savePostMetaItem,
  savePostMetaCollection,
  kill,
  findChildren,
  findByFormat,
  findByCategory,
  findMeta,
}
