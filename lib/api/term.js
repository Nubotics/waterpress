'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../core/util');

var find = function find(params, cb, next) {
  //console.log('user -> find',arguments, params)
  //console.log('user -> find', params, cb, next)
  if (this.collections) {
    this.collections.term.find().where(params).populate('taxonomyCollection').exec(function (err, termsCollection) {
      cb(err, termsCollection, next);
    });
  } else {
    cb('Not connected', null, next);
  }
}; //util

var byTaxonomy = function byTaxonomy(params, cb, next) {
  if (this.collections) {
    //TODO: deconstruct params
    this.collections.termtaxonomy.find().where(params).populate('term')
    //.populate('childCollection')
    .populate('relationshipCollection').exec(function (err, collection) {
      cb(err, collection, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};

//api export
exports.default = {
  find: find,
  byTaxonomy: byTaxonomy

};
module.exports = exports['default'];