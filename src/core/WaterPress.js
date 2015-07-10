/**
 * Created by nubuck on 15/07/09.
 */
//libs
import Waterline from 'waterline'
import mysqlAdapter from 'sails-mysql'
let _ = require('lodash')
//let extend = require('waterline/lib/waterline/utils/extend')

//models
import {user} from '../users/user.model'

class WaterPress extends Waterline {
  constructor() {
    super()
    this.init.bind(this)
    this.load.bind(this)
    this.kill.bind(this)

    console.log('wp instance', this)
  }

  init(options, cb) {
    let config = {
      adapters: {
        default: mysqlAdapter,
        mysql: mysqlAdapter
      },
      connections: {
        mysql: {
          adapter: 'mysql'
        }
      },
      defaults: {
        migrate: 'alter'
      }
    }

    config = _.extend(config, options)

    //console.log('Waterpress: config ext', config)

    let users = Waterline.Collection.extend(user)
    this.load(users)

    super.initialize(config, cb)

  }

  load(collection) {
    super.loadCollection(collection)
  }

  kill(cb) {
    super.teardown(cb)
  }


}

export default WaterPress
