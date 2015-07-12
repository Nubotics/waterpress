/**
 * Created by nubuck on 15/07/10.
 */
import Base from './BaseApi'
import orm from './WaterpressOrm'
import {_} from './util'

//api
import userApi from '../users/user.api'
import postApi from '../posts/post.api'
import termApi from '../terms/term.api'
import commentApi from '../comments/comment.api'

class WaterpressApi extends Base {
  constructor(options, cb) {
    super(options)
    if (cb) {
      super.connect(cb)
    }

    this._bindApiMethods('user', userApi)
    this._bindApiMethods('post', postApi)
    this._bindApiMethods('term', termApi)
    this._bindApiMethods('comment', commentApi)
  }

  _bindApiMethods(namespace, api) {
    this[namespace] = _.extend({},api)
    Object.keys(this[namespace]).forEach(key => {
      this[namespace][key] = this[namespace][key].bind(this)
    })
  }

}

export default WaterpressApi
