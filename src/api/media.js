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
  find(params, cb, next){
    if (this.collections) {
      cb(null,null,next)
    } else {
      cb('Not connected', null, next)
    }
  },
  one(params, cb, next){
    if (this.collections) {
      cb(null,null,next)
    } else {
      cb('Not connected', null, next)
    }
  },
  save(postObj, cb, next){
    if (this.collections) {
      cb(null,null,next)
    } else {
      cb('Not connected', null, next)
    }
  },
  kill(postId, cb, next){
    if (this.collections) {
      cb(null,null,next)
    } else {
      cb('Not connected', null, next)
    }
  }
}
