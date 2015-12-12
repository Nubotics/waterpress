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
import defaultModels from '../models'
import defaultApi from '../api'

//main
class Api extends EventApi {
  constructor(options) {
    /*
     * deconstructable options:
     * -> base:object
     * -> db:object
     * -> instance:object
     * -> pluginCollection:array
     * */

    if (!options) {
      throw('options parameter required')
      //TODO: add more constructor validation
    }

    //:: check for base opts
    //-> chain api
    //-> eventemmitter
    let baseOpts = {}
    if (has(options, 'base')) {
      baseOpts = options.eventApi
    }

    //:: init Event Api base class
    super(baseOpts)

    //:: check for instance opts
    //-> connections
    //-> collections
    let hasInstance = false
    if (has(options, 'instance')) {
      if (has(options.instance, 'connections')) {
        this.set('connections', options.instance.connections, true)
      }
      if (has(options.instance, 'collections')) {
        this.set('collections', options.instance.collections, true)
      }
      if (has(this, 'connections') && has(this, 'collections')) {
        hasInstance = true
      }
    }
    //-> set instance flag
    this.set('hasInstance', hasInstance, true)

    //:: check db waterline connection options
    if (has(options, 'db')) {
      this.setOption('db', options.db)
    }

    //:: Waterline data instance
    this.set('orm', null, true)

    //:: if !instance
    if (!this.hasInstance) {
    }

    //:: check for plugins opts
    let pluginCollection = []
    if (has(options, 'plugins')) {
      if (Array.isArray(options.plugins)) {
        pluginCollection = options.plugins
      }
    }

    //:: flatten plugin tree
    let pluginNames = []
    //-> models
    let newModelCollection = {}
    let overrideModelCollection = {}
    //-> api
    let newApiCollection = {}
    let overrideApiCollection = {}
    //-> deconstruct
    if (pluginCollection.length > 0) {
      forEach(pluginCollection, plugin=> {
        if (has(plugin, 'name')) {
          pluginNames.push(plugin.name)
          //-> new models
          if (has(plugin, 'modelCollection')) {
            if (Array.isArray(plugin.modelCollection)) {
              _.forEach(plugin.modelCollection, model=> {
                if (has(model, 'identity')) {
                  newModelCollection[model.identity] = model
                }
              })

            }
          }
          //-> new api
          if (has(plugin, 'apiCollection')) {
            if (Array.isArray(plugin.apiCollection)) {
              _.forEach(plugin.apiCollection, api=> {
                if (has(api, 'namespace')) {
                  newApiCollection[api.namespace] = api.methods
                }
              })
            }
          }
          //-> overrides
          if (has(plugin, 'override')) {
            //--> override models
            if (has(plugin.override, 'model')) {
              if (plugin.override.model) {
                console.log(`plugin ${plugin.name} model override`, plugin.override.model)
                eachKey(plugin.override.model, overModelKey=> {
                  overrideModelCollection = merge(overrideModelCollection, {[overModelKey]: plugin.override.model[overModelKey]})
                })
              }
            }
            //--> override apis
            if (has(plugin.override, 'api')) {
              if (plugin.override.api) {
                eachKey(plugin.override.api, overApiKey=> {
                  overrideApiCollection = merge(overrideApiCollection, {[overApiKey]: plugin.override.api[overApiKey]})
                })
              }
            }

          }
        }
        //-> no plugin name
        //TODO: does a plugin need a name?
      })
    }
    this.set('pluginNames', pluginNames)

    //:: safe loadable collections
    const mergeModelOverrides = (original, override)=> {
      eachKey(original, ogKey=> {
        if (has(override, ogKey)) {
          original[ogKey] = merge(original[ogKey], override[ogKey])
        }
      })
      return original
    }
    //-> models
    let modelCollection = {}
    eachKey(defaultModels, modKey=> {
      if (has(overrideModelCollection, modKey)) {
        modelCollection[modKey] = mergeModelOverrides(defaultModels[modKey], overrideModelCollection[modKey])
      } else {
        modelCollection = merge(modelCollection, {[modKey]: defaultModels[modKey]})
      }
    })
    modelCollection = merge(modelCollection, newModelCollection)
    this.set('modelCollection', modelCollection)
    //-> api
    let apiCollection = {}
    eachKey(defaultApi, apiKey=> {
      if (has(overrideApiCollection, apiKey)) {
        apiCollection = merge(apiCollection,
          merge(defaultApi[apiKey], overrideApiCollection[apiKey])
        )
      } else {
        apiCollection = merge(apiCollection, {[apiKey]: defaultApi[apiKey]})
      }
    })
    apiCollection = merge(apiCollection, newApiCollection)

    //:: Bind.bind ^_^
    this._bind.bind(this)
    this._bind(
      'connect',
      'disconnect',
      'plug'
    )

    //:: construct api methods
    eachKey(apiCollection, structKey=> {
      if (has(apiCollection, structKey)) {
        this
          ._addMethods(apiCollection[structKey], structKey)
          ._addMethod('done', function (cb, next) {
            //console.log('done', cb, next)
            if (cb) {
              cb(next)
            } else {
              next()
            }

          }, structKey, true)
      }

    })

  }

  _bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this))
  }

  connect(cb) {
    this.chain((next)=> {
      console.log('connect -> hasInstance', this.hasInstance)
      if (this.hasInstance) {
        if (cb) {
          let { collections, connections } = this
          console.log('connect -> collections, connections ', collections, connections)
          cb(null, {collections, connections}, next)
        } else {
          next()
        }
      } else {
        this.orm = new Orm()
        this.orm.init({
            connections: this.options.db.connections
          },
          this.modelCollection,
          (err, models)=> {
            //console.log('orm init -> err, models', err, models)
            if (err) throw err
            if (has(models, 'connections')) {
              //console.log('orm init -> has connections')
              this.set('connections', models.connections, true)
            }
            if (has(models, 'collections')) {
              //console.log('orm init -> has collections')
              this.set('collections', models.collections, true)
            }
            if (cb) {
              cb(err, models, next)
            } else {
              next()
            }
          })

      }
    })
    return this
  }

  disconnect(cb) {
    this.chain((next)=> {
      if (this.orm) {
        if (cb) {
          this.orm.kill(()=> {
            cb(next)
          })
        } else {
          this.orm.kill(next)
        }
      } else {
        if (cb) {
          cb(next)
        } else {
          next()
        }
      }
    })
    return this
  }

  plug(cb, namespace) {
    this.chain((next)=> {
      let args = [this, next]
      cb.apply(this, args)
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
