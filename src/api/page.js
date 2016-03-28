//util
import {

  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObject,
  merge,

} from '../core/util'

import postApi from './post'

//main
export default {
  find(params, cb, next){
    params = merge(params, {postType: 'page'})
    postApi.find.call(this, params, {}, function (err, pageCollection) {
      cb(err, pageCollection, next)
    })
  },
  one(params, cb, next){
    params = merge(params, {postType: 'page'})
    postApi.find.call(this, params, {}, function (err, page) {
      cb(err, page, next)
    })
  },
  save(postObj, cb, next){
    postObj = merge(postObj, {postType: 'page'})
    postApi.save.call(this, postObj, function (err, page) {
      cb(err, page, next)
    })
  },
  kill(postId, cb, next){
    postApi.kill.call(this, postId, function (err, result) {
      cb(err, result, next)
    })
  }
}
