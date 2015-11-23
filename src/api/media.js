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

import postApi from './post'

//main
export default {
  find(params, cb, next){
    params = assign(params, {postType: 'attachment'})
    postApi.find.call(this, params, {}, function (err, pageCollection) {
      cb(err, pageCollection, next)
    })
  },
  one(params, cb, next){
    params = assign(params, {postType: 'attachment'})
    postApi.find.call(this, params, {}, function (err, page) {
      cb(err, page, next)
    })
  },
  save(postObj, cb, next){
    if (this.collections) {
      cb(null, null, next)
    } else {
      cb('Not connected', null, next)
    }
  },
  kill(postId, cb, next){
    if (this.collections) {
      cb(null, null, next)
    } else {
      cb('Not connected', null, next)
    }
  }
}
