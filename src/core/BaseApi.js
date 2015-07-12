/**
 * Created by nubuck on 15/07/12.
 */
import WpOrm from './WaterpressOrm'
import EventEmitter from 'eventemitter3'

export default class BaseApi extends EventEmitter {
  constructor(options) {
    super()
    if (!options) {
      throw('options parameter required')
      //TODO: add more constructor validation
    }
    this.options = options
    this.orm = null
    this.collections = null
    this._bind('_connect', 'safeConnect', 'safeKill')
    this._isConnecting = false
    this.connections = 0
  }

  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this))
  }

  _connect(cb) {
    this.on('connected', cb, this)
    if (!this._isConnecting) {
      this._isConnecting = true
      this.orm = new WpOrm()
      this.orm.init(this.options, (err, schema)=> {
        if (err) {
          console.log('Error in Waterpress API connecting to ORM: ', err)
          cb(err)
        }
        this.collections = schema.collections
        this._isConnecting = false
        this.emit('connected', err, this.collections)
      })
    }
  }

  safeConnect(cb) {
    console.log('checkAndConnect', this.connections)
    this.connections++
    if (!this.collections) {
      console.log('no connection')
      this._connect(cb)
    } else {
      console.log('existing connection')
      cb(null, this.collections)
    }
  }

  safeKill(cb) {
    console.log('safe kill', this.connections)
    if (this.connections <= 1) {
      this.orm.kill(cb)
    } else {
      this.connections--
      cb()
    }
  }

}
