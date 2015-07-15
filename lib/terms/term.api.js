'use strict';

exports.__esModule = true;
var termApi = {
  all: function all(params, chainStart, chainEnd, cb) {
    var _this = this;

    var action = function action(collections) {
      collections.term.find().where(params).populate('taxonomyCollection').exec(function (err, terms) {
        if (chainEnd) {
          _this.safeKill(function () {
            cb(err, terms);
          });
        } else {
          cb(err, terms);
        }
      });
    };

    if (chainStart) {
      this.safeConnect(function (error) {
        if (error) throw error;

        action(_this.collections);
      });
    } else {

      action(this.collections);
    }
  },
  byPost: function byPost() {},
  byTaxonomy: function byTaxonomy(params, chainStart, chainEnd, cb) {
    var _this2 = this;

    var action = function action(collections) {
      collections.termtaxonomy.find().where(params).populate('term').populate('childCollection').populate('relationshipCollection').exec(function (err, data) {
        if (chainEnd) {

          _this2.safeKill(function () {
            cb(err, data);
          });
        } else {

          cb(err, data);
        }
      });
    };

    if (chainStart) {
      this.safeConnect(function (error) {
        if (error) throw error;
        action(_this2.collections);
      });
    } else {
      action(this.collections);
    }
  }
};

exports['default'] = termApi;
module.exports = exports['default'];