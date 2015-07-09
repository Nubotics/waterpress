/**
 * Created by nubuck on 15/07/09.
 */

import Waterline from 'waterline'
import mysqlAdapter from 'sails-mysql'

class WaterPress extends Waterline {
  constructor() {
   super()
    this.init.bind(this)
    this.load.bind(this)
    this.kill.bind(this)
  }

  init(options,cb){
    super.initialize(options,cb)

  }

  load(collection){
    super.loadCollection(collection)
  }

  kill(cb){
    super.teardown(cb)
  }


}

export default WaterPress
