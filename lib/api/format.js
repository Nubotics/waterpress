'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../core/util');

var _assemblers = require('../assemblers');

var _assemblers2 = _interopRequireDefault(_assemblers);

var _term = require('./term');

var _term2 = _interopRequireDefault(_term);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  find: function find(params, cb, next) {
    params = (0, _util.assign)(params, { taxonomy: 'post_format' });
    _term2.default.byTaxonomy.call(this, params, function (err, termTaxonomyCollection) {
      if (err) {
        cb(err, null, next);
      } else {
        if (termTaxonomyCollection) {
          cb(err, _assemblers2.default.category.collection(termTaxonomyCollection, null, true), next);
        } else {
          cb(err, termTaxonomyCollection, next);
        }
      }
    });
  }
}; //util

module.exports = exports['default'];