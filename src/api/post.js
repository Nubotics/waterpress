//util
import {
  _,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObjectFromKeyCollection,
  merge,

} from '../core/util'

//methods

//general crud
let assemblePostMeta = function (post) {
  if (has(post, 'metaCollection')) {
    post.metaObj = makeObjectFromKeyCollection(post.metaCollection)
    return post
  } else {
    return post
  }
}

let updatePostInPostCollection = function (termTaxId, postCollection, updatedPost) {
  let newPostCollection = postCollection.map(post=> {
    if (has(post, 'relationshipCollection')) {
      let currTermTax = _.find(post.relationshipCollection, {termTaxonomy: termTaxId})
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
  if (_.isArray(postCollection)) {
    let termTaxIdCollection = []
    postCollection.map(post=> {
      post = assemblePostMeta(post)
      post.categoryCollection = []
      post.formatCollection = []
      post.format = {name: 'standard', slug: 'standard', id: 0}
      if (has(post, 'relationshipCollection')) {
        if (_.isArray(post.relationshipCollection)) {
          if (post.relationshipCollection.length > 0) {
            post.relationshipCollection.map(relationship=> {
              termTaxIdCollection.push(relationship.termTaxonomy)
            })
          }
        }
      }
      if (has(post, 'author')) {
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
            if (_.isArray(collection)) {
              collection.map(termTax=> {
                let postUpdate = {
                  categoryCollection: [],
                  formatCollection: [],
                  format: {name: 'standard', slug: 'standard', id: 0},
                }
                if (termTax.taxonomy == 'category') {
                  postUpdate.categoryCollection.push(termTax.term)
                } else if (_.endsWith(termTax.taxonomy, '_format')) {
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
let find = function (params, options, cb, next) {
  if (this.collections) {
    if (!has(params,'postType')){
      params = assign(params, {postType: 'post'})
    }
    if (!has(params,'status')){
      params = assign(params, {status: ['publish', 'inherit']})
    }
    let query =
      this.collections
        .post
        .find()
        .where(params)

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
    find.call(this, params, options, cb, next)
    //cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}
let newer = function (firstId, limit, cb, next) {
  if (this.collections) {
    let params = {id: {'>': firstId}}
    let options = {sort: 'id DESC', limit}
    find.call(this, params, options, cb, next)
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
    if (_.isArray(post.relationshipCollection)) {
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
          let metaObj = makeObjectFromKeyCollection(metaCollection)
          callback(errUserMeta, metaCollection, metaObj)
        }
      })
  }
  let actionCb = (err, post, next)=> {
    if (has(post, 'author')) {
      delete post.author.password
      populateUserMeta((metaErr, metaCollection, metaObj)=> {
        if (metaErr){
          cb(metaErr, post, next)
        }else{
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
          if (_.isArray(collection)) {
            collection.map(termTax=> {
              if (termTax.taxonomy == 'category') {
                post.categoryCollection.push(termTax.term)
              } else if (_.endsWith(termTax.taxonomy, '_format')) {
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
    cb(e, post, next)
  }
}
let one = function (params, cb, next) {
  if (this.collections) {
    if (!has(params,'postType')){
      params = assign(params, {postType: 'post'})
    }
    if (!has(params,'status')){
      params = assign(params, {status: ['publish', 'inherit']})
    }
    this.collections
      .post
      .findOne()
      .where(params)
      .populate('author')
      .populate('relationshipCollection')
      .populate('metaCollection')
      .exec((e, post)=> {
        if (e) {
          cb(e, post, next)
        } else {
          populatePost.call(this, e, post, cb, next)
        }
      })
  } else {
    cb('Not connected', null, next)
  }
}
//TODO: save
let save = function (postObj, cb, next) {
  if (this.collections) {
    cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}
//TODO: kill
let kill = function (postId, cb, next) {
  if (this.collections) {
    cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}

//help crud
let findChildren = function (postId, cb, next) {
  if (this.collections) {
    let params = {parent: postId}
    let options = {sort: 'id DESC'}
    find.call(this, params, options, cb, next)
  } else {
    cb('Not connected', null, next)
  }
}
let findByFormat = function (format, options, cb, next) {
  if (this.collections) {
    let params = {taxonomy: {'endsWith': '_format'}}
    this.collections
      .termtaxonomy
      .find()
      .where(params)
      .populate('term')
      .populate('relationshipCollection')
      .exec((e, termTaxCollection)=> {
        let filterResult = []
        _.map(termTaxCollection, termTax=> {
          if (_.contains(termTax.term.slug, format)
            || _.contains(termTax.term.name, format)) {
            filterResult.push(termTax)
          }
        })
        let postIdCollection = []
        if (filterResult.length > 0) {
          _.map(filterResult, filterTermTax=> {
            if (has(filterTermTax, 'relationshipCollection')) {
              _.map(filterTermTax.relationshipCollection, relation=> {
                postIdCollection.push(relation.object)
              })
            }
          })
          if (postIdCollection.length > 0) {
            find.call(this, {id: postIdCollection}, options, cb, next)
          } else {
            cb(e, [], next)
          }

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
    this.collections
      .termtaxonomy
      .find()
      .where(params)
      .populate('term')
      .populate('relationshipCollection')
      .exec((e, termTaxCollection)=> {
        let filterResult = []
        _.map(termTaxCollection, termTax=> {
          if (_.contains(termTax.term.slug, category)
            || _.contains(termTax.term.name, category)) {
            filterResult.push(termTax)
          }
        })
        let postIdCollection = []
        if (filterResult.length > 0) {
          _.map(filterResult, filterTermTax=> {
            if (has(filterTermTax, 'relationshipCollection')) {
              _.map(filterTermTax.relationshipCollection, relation=> {
                postIdCollection.push(relation.object)
              })
            }
          })
          if (postIdCollection.length > 0) {
            find.call(this, {id: postIdCollection}, options, cb, next)
          } else {
            cb(e, [], next)
          }

        } else {
          cb(e, [], next)
        }
      })
  } else {
    cb('Not connected', null, next)
  }

}

//api export
export default {
  find,
  older,
  newer,
  one,
  save,
  kill,
  findChildren,
  findByFormat,
  findByCategory,

}
