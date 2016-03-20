//util
import {
  includes,
  map,
  endsWith,
  find,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  is,
  makeObject,
  merge,

} from '../core/util'
import {
  striptags,
  truncate,
  slugger,
} from '../addons'

//methods
const  makeExcerpt = function (content) {
  let result = striptags(content)
  result = truncate(result, 100)
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
    if (!has(params, 'postType')) {
      params = assign(params, {postType: 'post'})
    }
    if (!has(params, 'status')) {
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
      delete post.author.password
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
    cb(e, post, next)
  }
}
let one = function (params, cb, next) {
  if (this.collections) {
    if (!has(params, 'postType')) {
      params = assign(params, {postType: 'post'})
    }
    if (!has(params, 'status')) {
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

    //:-> validate postObj
    //-> !has -> author -> error
    if (!has(postObj, 'author')) {
      cb('No author supplied', null, next)
    } else {
      let query = {}
      //-> !has -> slug -> generate
      if (!has(postObj, 'slug')) {

      }
      //-> !has -> postType -> default
      if (!has(postObj, 'postType')) {

      }
      //-> !has -> excerpt -> generate
      if (!has(postObj, 'excerpt')) {

      }
      //-> !has -> status -> default
      if (!has(postObj, 'status')) {

      }
      //-> !has -> guid -> generate
      if (!has(postObj, 'guid')) {

      }
      //-> !has -> relationshipCollection -> default
      if (!has(postObj, 'relationshipCollection')) {

      }

      //:-> check slug exists && slug belongs to author
      const findExistingPost = (cb)=>{
        cb()
      }
      //-> exists -> generate suffix
      const uniqueSlug = (slug)=>{

      }
      //-> if -> slug && author exist || has -> postObj -> id
      //-> update
      const updatePost = (cb)=>{

      }
      //-> else
      //-> create
      const createPost = (cb)=>{

      }
      //-> get populated post

      //:-> yield
      cb(null, null, next)
    }

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
    findPost.call(this, params, options, cb, next)
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
        map(termTaxCollection, termTax=> {
          if (contains(termTax.term.slug, format)
            || contains(termTax.term.name, format)) {
            filterResult.push(termTax)
          }
        })
        let postIdCollection = []
        if (filterResult.length > 0) {
          map(filterResult, filterTermTax=> {
            if (has(filterTermTax, 'relationshipCollection')) {
              map(filterTermTax.relationshipCollection, relation=> {
                postIdCollection.push(relation.object)
              })
            }
          })
          if (postIdCollection.length > 0) {
            findPost.call(this, {id: postIdCollection}, options, cb, next)
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
        map(termTaxCollection, termTax=> {
          if (contains(termTax.term.slug, category)
            || contains(termTax.term.name, category)) {
            filterResult.push(termTax)
          }
        })
        let postIdCollection = []
        if (filterResult.length > 0) {
          map(filterResult, filterTermTax=> {
            if (has(filterTermTax, 'relationshipCollection')) {
              map(filterTermTax.relationshipCollection, relation=> {
                postIdCollection.push(relation.object)
              })
            }
          })
          if (postIdCollection.length > 0) {
            findPost.call(this, {id: postIdCollection}, options, cb, next)
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
  find: findPost,
  older,
  newer,
  one,
  save,
  kill,
  findChildren,
  findByFormat,
  findByCategory,

}
