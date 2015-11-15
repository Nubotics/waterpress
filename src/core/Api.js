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
 * */

import Orm from './Orm'
import wpApi from '../api'

//main
class Api extends EventApi {
  constructor(options) {
    if (!options) {
      throw('options parameter required')
      //TODO: add more constructor validation
    }
    options = assign(options, {}) || {}
    super(options)

    this.orm = null
    this.collections = null
    this.connections = null

    if (has(options, 'connections') && has(options, 'collections')) {
      this.connections = options.connections
      this.collections = options.collections
    }

    this._bind(
      'connect',
      'disconnect',
      'plug'
    )

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
    methods.forEach((method) => this[method] = this[method].bind(this))
  }

  connect(cb) {
    this.chain((next)=> {
      if (this.collections && this.connections) {

        if (cb) {
          let { collections, connections } = this
          cb(null, {collections, connections}, next)
        }

      } else {

        this.orm = new Orm()
        this.orm.init({connections: this.options.connections}, (err, models)=> {
          //console.log('orm init -> err, models', err, models)
          if (err) throw err
          if (has(models, 'connections')) {
            this.connections =  models.connections
          }
          if (has(models, 'collections')) {
            this.collections = models.collections
          }
          if (cb) cb(err, models, next)
        })

      }
    })
    return this
  }

  disconnect(cb) {
    this.chain((next)=> {
      if (!this.orm) {
        next()
        this.orm.kill(cb)
      } else {
        next()
        if (cb) cb()
      }
    })
  }

  plug(cb, namespace) {
    this.chain((next)=> {
      cb.apply(this, next)
    })
    if (namespace) {
      if (has(this, namespace)) {
        return this[namespace]
      } else {
        return this
      }
    } else {
      return this
    }
  }

}

//exports
export default Api
