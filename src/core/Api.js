/**
 * Created by nubuck on 15/07/10.
 */
import WaterPress from './WaterPress'
class Api {
  constructor(options, cb) {

    this._collections = []
    this._wp = null

    if (!this._wp) {

      this._wp = new WaterPress()


      this._wp.init(options, (err, schema)=> {
        if (err) {
          console.log('err', err)
          cb(err)
        }

        this._collections = schema.collections

        console.log('Api init', this)
        cb(this._collections)

      })

    }

  }
}

export default Api
