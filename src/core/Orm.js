//libs
import Waterline from 'waterline'
import mysqlAdapter from 'sails-mysql'

//util
import {
  _,
  eachKey,
  forEach,
  assign,
  has,

} from './util'

//models
//import models from '../models'

//main
class Orm extends Waterline {
  constructor() {
    super()
    this._safeOverride.bind(this)
    this.init.bind(this)
    this.load.bind(this)
    this.kill.bind(this)

  }

  _safeOverride(key, model) {
    if (!has(this.config, 'override')) {
      this.load(model)
    } else {
      if (!has(this.config.override, 'model')) {
        this.load(model)
      } else if (has(this.config.override.model, key)) {
        this.load(this.config.override.model[key])
      } else {
        this.load(model)
      }
    }
  }

  init(options, models, cb) {
    let config = {
      adapters: {
        default: mysqlAdapter,
        mysql: mysqlAdapter
      },
      connections: {
        mysql: {
          adapter: 'mysql'
        }
      }
    }

    eachKey(options, key => {
      if (has(config, key)) {
        config[key] = assign(config[key], options[key])
      }
      else {
        config[key] = options[key]
      }
    })

    this.config = config

    //init models
    eachKey(models, key => {
      this._safeOverride(key, models[key])
    })

    this.initialize(this.config, cb)

  }

  load(collection) {
    this.loadCollection(Waterline.Collection.extend(collection))
  }

  kill(cb) {
    this.teardown(cb)
  }

}

export default Orm
