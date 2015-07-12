/**
 * Created by nubuck on 15/07/09.
 */
//libs
import Waterline from 'waterline'
import mysqlAdapter from 'sails-mysql'
let _ = require('lodash')
//let extend = require('waterline/lib/waterline/utils/extend')

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
        migrate: 'safe'
      }
    }

    config = _.extend(config, options)

    //console.log('WaterpressOrm: config ext', config)
    //init users
    let users = Waterline.Collection.extend(user)
    let usersMeta = Waterline.Collection.extend(userMeta)
    this.load(users)
    this.load(usersMeta)

    //init posts
    let posts = Waterline.Collection.extend(post)
    let postsMeta = Waterline.Collection.extend(postMeta)
    this.load(posts)
    this.load(postsMeta)

    //init comments
    let comments = Waterline.Collection.extend(comment)
    let commentsMeta = Waterline.Collection.extend(commentMeta)
    this.load(comments)
    this.load(commentsMeta)

    //init terms
    let terms = Waterline.Collection.extend(term)
    let termTaxonomies = Waterline.Collection.extend(termTaxonomy)
    let termRelationships = Waterline.Collection.extend(termRelationship)
    this.load(terms)
    this.load(termTaxonomies)
    this.load(termRelationships)

    super.initialize(config, cb)

    //console.log('wp instance init', this)

  }

  load(collection) {
    super.loadCollection(collection)
  }

  kill(cb) {
    super.teardown(cb)
  }


}

export default WaterpressOrm
