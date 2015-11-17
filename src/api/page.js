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
    params = assign(params, {postType: 'page'})
    this.post.find(params, (err, pageCollection, cbNext)=> {
      cb(err, pageCollection, cbNext)
    })
  },
  one(params, cb, next){
    params = assign(params, {postType: 'page'})
    this.post.one(params, (err, page, cbNext)=> {
      cb(err, page, cbNext)
    })
  },
  save(postObj, cb, next){

  },
  kill(postId, cb, next){

  }
}
