//util
import { pluginUtils } from '../../../addons'
let {
  _,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObjectFromKeyCollection,
  merge,

  } = pluginUtils

//create API
let activityApi = {
  namespace: 'activity',
  methods: {}
}

let advertApi = {
  namespace: 'advert',
  methods: {}
}

let bookmarkApi = {
  namespace: 'bookmark',
  methods: {}
}

let followingApi = {
  namespace: 'following',
  methods: {}
}

let imperativeApi = {
  namespace: 'imperative',
  methods: {}
}

let likeApi = {
  namespace: 'like',
  methods: {}
}

let profileApi = {
  namespace: 'profile',
  methods: {
    all(params, cb, next){

    },
    one(params, cb, next){

    },
    byRole(roleName, cb, next){

    }
  }
}

let shareApi = {
  namespace: 'share',
  methods: {}
}

let storyApi = {
  namespace: 'story',
  methods: {
    all(params, cb, next){

    },
    older(lastId, cb, next){

    },
    newer(firstId, cb, next){

    },
    one(params, cb, next){

    },
    create(storyObj, cb, next){

    },
    update(storyObj, cb, next){

    }
  }
}

let storyReadApi = {
  namespace: 'story',
  methods: {}
}

export default {
  activityApi,
  advertApi,
  bookmarkApi,
  followingApi,
  imperativeApi,
  likeApi,
  profileApi,
  shareApi,
  storyApi,
  storyReadApi,

}
