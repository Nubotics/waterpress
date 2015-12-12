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

//TODO: comment all
//methods
let find = function(params, cb, next){
  if (this.collections) {
    cb(null, {commentCollection: []}, next)
  } else {
    cb('Not connected', null, next)
  }
}
let one = function(params, cb, next){
  if (this.collections) {
    cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}
let save = function(commentObj, cb, next){
  if (this.collections) {
    cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}
let kill = function(commentId, cb, next){
  if (this.collections) {
    cb(null, null, next)
  } else {
    cb('Not connected', null, next)
  }
}

//api export
export default {
  find,
  one,
  save,
  kill,
}
