/**
 * Created by nubuck on 15/07/09.
 */
//libs
import Waterline from 'waterline'
import mysqlAdapter from 'sails-mysql'
let _ = require('lodash')
//let extend = require('waterline/lib/waterline/utils/extend')
import log from './log'
//models
import {user, userMeta} from '../users/user.model'
import {post, postMeta} from '../posts/post.model'
import {term, termTaxonomy, termRelationship} from '../terms/term.model'
import {comment, commentMeta} from '../comments/comment.model'

class WaterpressOrm extends Waterline {
  constructor() {
    super()
    this.init.bind(this)
    this.load.bind(this)
    this.kill.bind(this)

    this._safeOverride.bind(this)
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
      }/*,
      defaults: {
        migrate: 'safe'
      }*/
    }

    Object.keys(options).forEach(key => {
      if (_.has(config, key)) {
        config[key] = _.extend(config[key], options[key])
      }
      else {
        config[key] = options[key]
      }
    })

    this.config = config

    //console.log('WaterpressOrm: config ext', this.config)

    //init models
    this._safeOverride('user', user)
    this._safeOverride('userMeta', userMeta)
    this._safeOverride('post', post)
    this._safeOverride('postMeta', postMeta)
    this._safeOverride('comment', comment)
    this._safeOverride('commentMeta', commentMeta)
    this._safeOverride('term', term)
    this._safeOverride('termTaxonomy', termTaxonomy)
    this._safeOverride('termRelationship', termRelationship)

    log.info('waterpress | ORM | init | super initialize')
    super.initialize(this.config, cb)

    //console.log('wp instance init', this)

  }

  _safeOverride(key, model) {
    if (!_.has(this.config, 'override')) {
      this.load(model)
    } else {
      if (!_.has(this.config.override, 'model')) {
        this.load(model)
      } else if (_.has(this.config.override.model, key)) {
        //console.log('Model override', key, this.config.override.model[key])
        this.load(this.config.override.model[key])
      } else {
        this.load(model)
      }
    }
  }

  load(collection) {
    this.loadCollection(Waterline.Collection.extend(collection))
  }

  kill(cb) {
    log.info('waterpress | ORM | teardown')
    this.teardown(cb)
  }


}

export default WaterpressOrm
