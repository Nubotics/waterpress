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

//main
export default {
  find(params, cb, next){
    if (this.collections) {
      cb(null, null, next)
    } else {
      cb('Not connected', null, next)
    }
  },
  one(params, cb, next){
    if (this.collections) {
      cb(null, null, next)
    } else {
      cb('Not connected', null, next)
    }
  },
//TODO: save + kill
}
