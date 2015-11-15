//util
import {
  _,
  has,
  assign,
  forEach,
  merge,
  eachKey,
  findValue,

} from '../core/util'

export default {
  findOne(params, cb, next){
    //console.log('user -> find',arguments, params)
    //console.log('user -> find', params, cb, next)
    cb(null, {termCollection: []}, next)

  }
}

