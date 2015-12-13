'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

var getInstanceOptions = function getInstanceOptions(req, options) {
  var app = null;
  if (!req) {
    return options;
  } else {

    app = req.app;

    if (!app) {
      if (_coreUtil.has(req, 'connections') && _coreUtil.has(req, 'collections')) {
        app = req;
      }
    }
    if (!app) {
      return options;
    } else {
      var instance = { collections: {}, connections: {} };
      var _false = false;
      var hasCollections = _false.hasCollections;
      var hasConnections = _false.hasConnections;

      if (_coreUtil.has(app, 'collections')) {
        hasCollections = true;
        instance.collections = app.collections;
      }
      if (_coreUtil.has(app, 'connections')) {
        hasConnections = true;
        instance.connections = app.connections;
      }
      if (hasCollections && hasConnections) {
        options.instance = instance;
        return options;
      } else {
        return options;
      }
    }
  }
};

var setInstance = function setInstance(app, connections, collections) {
  app.collections = collections;
  app.connections = connections;
  return app;
};

exports['default'] = {
  getInstanceOptions: getInstanceOptions,
  setInstance: setInstance

};
module.exports = exports['default'];