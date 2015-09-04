/**
 * Created by nubuck on 15/07/09.
 */

import WaterpressOrm from './core/WaterpressOrm'
import WaterpressApi from './core/WaterpressApi'
import {_,findValue,makeObjectFromKeyCollection} from './core/util'

let util = {_, findValue, makeObjectFromKeyCollection}

//raw models
import {user, userMeta} from './users/user.model'
import {post, postMeta} from './posts/post.model'
import {term, termTaxonomy, termRelationship} from './terms/term.model'
import {comment, commentMeta} from './comments/comment.model'

const models = {
  user,
  userMeta,
  post,
  postMeta,
  term,
  termTaxonomy,
  termRelationship,
  comment,
  commentMeta
}

//raw api
import userApi from './users/user.api'
import postApi from './posts/post.api'
import termApi from './terms/term.api'
import commentApi from './comments/comment.api'

const api = {
  user: userApi,
  post: postApi,
  term: termApi,
  comment: commentApi
}

export {
  WaterpressOrm,
  WaterpressApi,
  util,
  models,
  api
}
