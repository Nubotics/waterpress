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
    super(options)

    this._bindApiMethods.bind(this)
    this._safeBindApiMethods.bind(this)

    this._safeBindApiMethods('user', userApi)
    this._safeBindApiMethods('post', postApi)
    this._safeBindApiMethods('term', termApi)
    this._safeBindApiMethods('comment', commentApi)

    if (cb) {
      this.safeConnect(cb)
    }
  }

  _safeBindApiMethods(namespace, api) {
    if (_.has(this.options, 'override')) {
      if (_.has(this.options.override, 'api')) {
        if (_.has(this.options.override.api, namespace)) {
          this._bindApiMethods(namespace, this.options.override.api[namespace])
        } else {
          this._bindApiMethods(namespace, api)
        }
      } else {
        this._bindApiMethods(namespace, api)
      }
    } else {
      this._bindApiMethods(namespace, api)
    }
  }

  _bindApiMethods(namespace, api) {
    if (!_.has(this, namespace)) {
      this[namespace] = _.extend({}, api)
    } else {
      this[namespace] = _.extend(this[namespace], api)
    }
    Object.keys(api).forEach(key => {
      this[namespace][key] = this[namespace][key].bind(this)
    })
  }


}

export default WaterpressApi
