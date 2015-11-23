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
let find = function (params, options, cb, next) {
  if (this.collections) {

    //let query =
    this.collections
      .post
      .find()
      .where(params)
      .populate('author')
      .populate('metaCollection')
      .populate('relationshipCollection')
      .limit(3)
      /*
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
       .populate('relationshipCollection')
       .populate('metaCollection')

       if (has(options, 'includeChildCollection')){
       if (options.includeChildCollection){
       query.populate('childCollection')
       }
       }

       query*/
      .exec((e, postCollection)=> {
        cb(e, postCollection, next)
      })


  } else {
    cb('Not connected', null, next)
  }
}
let findAll = function (params, options, cb, next) {
  if (this.collections) {

    let query = this.collections
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
      .populateAll()
      .exec((e, postCollection)=> {
        cb(e, postCollection, next)
      })


  } else {
    cb('Not connected', null, next)
  }
}
let older = function (lastId, cb, next) {
  if (this.collections) {
    cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}
let newer = function (firstId, cb, next) {
  if (this.collections) {
    cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}
let one = function (params, cb, next) {
  if (this.collections) {
    this.collections
      .post
      .findOne()
      .where(params)
      .populate('author')
      .populate('relationshipCollection')
      .populate('metaCollection')
      .exec((e, post)=> {
        cb(e, post, next)
      })
  } else {
    cb('Not connected', null, next)
  }
}
let save = function (postObj, cb, next) {
  if (this.collections) {
    cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}
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
    this.collections
      .post
      .find()
      .where({parent: postId})
      .populate('author')
      .populate('relationshipCollection')
      .populate('metaCollection')
      .exec((e, postCollection)=> {
        cb(e, postCollection, next)
      })
  } else {
    cb('Not connected', null, next)
  }
}

//api export
export default {
  find,
  findAll,
  older,
  newer,
  one,
  save,
  kill,
  findChildren,

}
