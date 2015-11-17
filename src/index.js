import {
  EventApi,
  Api,
  Orm,
  u,
} from './core'

import models from './models'

export {
  EventApi,
  Api,
  Orm,
  u,
  models,

}

export default function (options){
  return new Api(options)
}

