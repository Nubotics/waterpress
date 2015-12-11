import {
  EventApi,
  Api,
  Orm,
  u,
} from './core'

import models from './models'

import addons from './addons'

export {
  EventApi,
  Api,
  Orm,
  u,
  models,
  addons,
}

export default function (options){
  return new Api(options)
}

