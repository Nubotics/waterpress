/**
 * Created by nubuck on 15/07/12.
 */
import WpOrm from './WaterpressOrm'
import EventEmitter from 'eventemitter3'
import {_} from './util'
import log from './log'
export default class BaseApi extends EventEmitter {
  constructor(options) {
    super()
    if (!options) {
      throw('options parameter required')
      //TODO: add more constructor validation
    }
    this.options = options
    if (!_.has(options, 'Orm')) {
      this.options.Orm = WpOrm
    }
    this.orm = null
    this.collections = null
    this.connections = null
    this._bind('_connect', 'safeConnect', 'safeKill')
    this._isConnecting = false
    this.clientConnections = 0
  }

  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this))
  }

  _connect(cb) {
    this.on('connected', cb, this)
    if (!this._isConnecting) {
      this._isConnecting = true

      ////console.log('_connect', this.orm)

      //&& this.connections && this.collections

      /*    if (this.clientConnections > 0 ) {
       this._isConnecting = false
       this.emit('connected', null, this.collections)
       } else {*/
      this.orm = new this.options.Orm()
      try{
      this.orm.init(this.options, (err, schema)=> {
        if (err) {
          ////console.log('Error in Waterpress API connecting to ORM: ', err)
          this.emit('connected', err, this.collections)
        } else {
          this.connections = schema.connections
          this.collections = schema.collections
          this._isConnecting = false
          this.emit('connected', err, this.collections)
        }

      })
      //}
      }catch(e){
        process.nextTick(()=>{this._connect(cb)});
      }
    }
  }

  safeConnect(cb) {

    log.info('Waterpress | base api | safe connect', this.clientConnections)
    if (this.clientConnections == 0) {
      //console.log('no connection')
      this.clientConnections++
      this._connect(cb)
    } else {
      //console.log('existing connection')
      //this.clientConnections++
      cb(null, this.collections)
    }

  }

  safeKill(cb) {
    log.info('Waterpress | base api | safe kill', this.clientConnections)
    //console.log('safe kill', this.clientConnections)
    if (this.clientConnections <= 1) {
      //console.log('safe kill', 'kill')
      this.clientConnections = 0
      this.orm.kill(cb)
    } else {
      //console.log('safe kill', 'continue')
      this.clientConnections--
      if (cb) cb()
    }
  }

}
