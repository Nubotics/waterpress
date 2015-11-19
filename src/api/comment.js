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
let find = function(params, cb, next){
  cb(null, {commentCollection: []}, next)
}
let one = function(params, cb, next){
  cb(null, null, next)
}
let save = function(commentObj, cb, next){
  cb(null, null, next)
}
let kill = function(commentId, cb, next){
  cb(null, null, next)
}

//api export
export default {
  find,
  one,
  save,
  kill,
}
