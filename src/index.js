import {
  EventApi,
  Api,
  Orm,
  u,
} from './core'
import models from './models'
import methods from './api'
import addons from './addons'

export {
  EventApi,
  Api,
  Orm,
  u,
  models,
  methods,
  addons,
}

export default function (options){
  return new Api(options)
}

