//:: NEW
//-> models
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

//-> api
import {
  activityApi,
  advertApi,
  attachmentApi,
  bookmarkApi,
  storyApi,

} from './api'

//:: OVERRIDES
//->models
let userModel = {
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
//->api
let userApi = {
  one(parans, cb, next){
  },
  find(params, cb, next){
  },
  byRole(roleName, cb, next){
  },
  byPassport(params, cb, next){
  },
  register(userObj, cb, next){
  },
  save(userObj, cb, next){

  }
}

//:: plugin
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
      user: userModel,
    },
    api: {
      user: userApi,
    }
  }
}

//exports
export default pluginNioPressCommunity

