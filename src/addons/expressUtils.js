import {
  has,
} from '../core/util'

const getInstanceOptions = function (req, options) {
  let app = null
  if (!req) {
    return options
  } else {

    app = req.app

    if (!app) {
      if (has(req, 'connections') && has(req, 'collections')) {
        app = req
      }
    }
    if (!app) {
      return options
    } else {
      let instance = {collections: {}, connections: {}}
      let { hasCollections, hasConnections } = false
      if (has(app, 'collections')) {
        hasCollections = true
        instance.collections = app.collections
      }
      if (has(app, 'connections')) {
        hasConnections = true
        instance.connections = app.connections
      }
      if (hasCollections && hasConnections) {
        options.instance = instance
        return options
      } else {
        return options
      }
    }
  }
}

const setInstance = function (app, connections, collections) {
  app.collections = collections
  app.connections = connections
  return app
}

export default {
  getInstanceOptions,
  setInstance,

}
