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

//main
export default {
  find(params, options, cb, next){
    if (this.collections) {

      let query = this.collections
        .post
        .find()
        .where(params)

      if (has(options, 'limit')) {
        query.limit(options.limit)
      }

      if (has(options, 'sort')) {
        query.sort(options.sort)
      }

      query
        .populate('author')
        .populate('relationshipCollection')
        .populate('metaCollection')
        .exec((e, postCollection)=> {
          cb(e, postCollection, next)
        })


    } else {
      cb('Not connected', null, next)
    }
  },
  older(lastId, cb, next){
    if (this.collections) {
    } else {
      cb('Not connected', null, next)
    }
  },
  newer(firstId, cb, next){
    if (this.collections) {
    } else {
      cb('Not connected', null, next)
    }
  },
  one(params, cb, next){
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
  },
  save(postObj, cb, next){
    if (this.collections) {
    } else {
      cb('Not connected', null, next)
    }
  },
  kill(postId, cb, next){
    if (this.collections) {
    } else {
      cb('Not connected', null, next)
    }
  }
}
