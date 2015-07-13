/**
 * Created by nubuck on 15/07/10.
 */
import Base from './BaseApi'
//import orm from './WaterpressOrm'
import {_} from './util'

//api
import userApi from '../users/user.api'
import postApi from '../posts/post.api'
import termApi from '../terms/term.api'
import commentApi from '../comments/comment.api'

class WaterpressApi extends Base {
  constructor(options, cb) {
    //TODO: validate options

    let basicConfig = {connections: options.connections}
    if (_.has(options, 'Orm')) {
      basicConfig.Orm = options.Orm
    }

    super(basicConfig)

    if (cb) {
      super.connect(cb)
    }

    this._bindApiMethods('user', userApi)
    this._bindApiMethods('post', postApi)
    this._bindApiMethods('term', termApi)
    this._bindApiMethods('comment', commentApi)
  }

  _bindApiMethods(namespace, api) {
    if (!_.has(this, namespace)){
      this[namespace] = _.extend({}, api)
    }else{
      this[namespace] = _.extend(this[namespace], api)
    }
    Object.keys(api).forEach(key => {
      this[namespace][key] = this[namespace][key].bind(this)
    })
  }

}

export default WaterpressApi
