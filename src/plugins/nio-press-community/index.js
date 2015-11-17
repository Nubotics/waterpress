//util
import {
  _,
  has,
  assign,
  forEach,
  merge,
  eachKey,
  findValue,

} from '../core/util'

import {
  bookmark,
  curation,
  curationBookmark,
  following,
  like,
  passport,
  read,
  settings,
  share,

} from './models'
import {
  activityApi,
  advertApi,
  attachmentApi,
  bookmarkApi,
  storyApi,

} from './api'

//::: OVERRIDES :::

//models

let user = {
  attributes: {
    passportCollection: {
      collection: 'passport',
      via: 'user'
    },
    followersCollection: {
      collection: 'following',
      via: 'followUser'
    }
  }
}


//plugin
const pluginNioPressCommunity = {
  name: 'nio-press-community',
  modelCollection: [
    bookmark,
    curation,
    curationBookmark,
    following,
    like,
    passport,
    read,
    settings,
    share,
  ],
  apiCollection: [
    activityApi,
    advertApi,
    attachmentApi,
    bookmarkApi,
    storyApi,

  ],
  //-> overrides
  override: {
    model: {
      user
    },
    api: {}
  }
}

//exports
export default pluginNioPressCommunity

