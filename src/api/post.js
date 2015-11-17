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
    //console.log('user -> find',arguments, params)
    //console.log('user -> find', params, cb, next)
    cb(null, {postCollection: []}, next)

  },
  older(lastId,cb,next){

  },
  newer(firstId,cb,next){

  },
  one(params, cb, next){

  },
  save(postObj, cb, next){

  },
  kill(postId, cb, next){

  }
}
