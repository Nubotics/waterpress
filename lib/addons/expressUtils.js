'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../core/util');

var getInstanceOptions = function getInstanceOptions(req, options) {
  var app = null;
  if (!req) {
    return options;
  } else {

    app = req.app;

    if (!app) {
      if ((0, _util.has)(req, 'connections') && (0, _util.has)(req, 'collections')) {
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

      if ((0, _util.has)(app, 'collections')) {
        hasCollections = true;
        instance.collections = app.collections;
      }
      if ((0, _util.has)(app, 'connections')) {
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

exports.default = {
  getInstanceOptions: getInstanceOptions,
  setInstance: setInstance

};
module.exports = exports['default'];