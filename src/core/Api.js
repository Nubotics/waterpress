//libs
import EventApi from './EventApi'
import debug from 'debug'

//util
import {
  _,
  has,
  assign,
  forEach,
  merge,
  eachKey,
  findValue,

} from './util'



//main
class Api extends EventApi {
  constructor(options){
    if (!options) {
      throw('options parameter required')
      //TODO: add more constructor validation
    }
    options = assign(options,{}) || {}
    super(options)

    this.orm = null
    this.collections = null
    this.connections = null

    if (has(options,'connections') && has(options,'collections')){
      this.connections = options.connections
      this.collections = options.collections
    }

  }

  _bind(...methods) {
    forEach(methods,method => this[method] = this[method].bind(this))
  }

  _connect(cb) {

  }

  _kill(cb) {

  }

}

//exports

