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

/*
 * API interface
 *
 * pure function action
 *
 *
 *
 *
 * */

import wpApi from '../api'

//main
class Api extends EventApi {
  constructor(options) {
    if (!options) {
      throw('options parameter required')
      //TODO: add more constructor validation
    }
    options = assign(options, {

      }) || {}
    super(options)

    this.orm = null
    this.collections = null
    this.connections = null

    if (has(options, 'connections') && has(options, 'collections')) {
      this.connections = options.connections
      this.collections = options.collections
    }

    eachKey(wpApi, key=> {
      //console.log('api -> key', wpApi, key)
      this
        ._addMethods(wpApi[key], key)
        ._addMethod('done', (cb, next)=> {
          //console.log('done')
          if (cb) {
            cb(next)
          } else {
            next()
          }

        }, key, true)
    })


  }

  _bind(...methods) {
    forEach(methods, method => this[method] = this[method].bind(this))
  }

  _bindApiMethods(namespace, api) {
    /*   if (!has(this, namespace)) {
     this[namespace] = merge({}, api)
     this[namespace]['done'] = (cb)=> {
     this.chain((next)=> {
     cb(next)
     })
     return this
     }
     } else {
     this[namespace] = merge(this[namespace], api)
     }*/
    /*  eachKey(api, key => {
     this[namespace][key] = function () {
     let args = arguments
     this.chain((next)=> {
     this[namespace][key].call(this, next, args)
     })
     return this[namespace]
     }.bind(this)

     })*/

  }

  _connect(cb) {

  }

  _kill(cb) {

  }

  plug(cb) {
    this.chain((next)=> {
      cb(next)
    })
    return this
  }

}

//exports
export default Api
