'use strict';

exports.__esModule = true;
var termApi = {
  all: function all(cb) {
    var _this = this;

    this.safeConnect(function (error) {
      if (error) throw error;

      _this.collections.term.find().populate('taxonomyCollection').exec(function (err, terms) {
        _this.safeKill(function () {
          cb(err, terms);
        });
      });
    });
  },
  byPost: function byPost() {},
  byTaxonomy: function byTaxonomy(params, cb) {
    var _this2 = this;

    this.safeConnect(function (error) {
      if (error) throw error;

      //console.log('bytaxonomy',  this.collections.user)

      _this2.collections.termtaxonomy.find().where(params).populate('term').populate('childCollection').populate('relationshipCollection').exec(function (err, data) {

        cb(err, data);

        _this2.safeKill();
      });
    });
  }
};

exports['default'] = termApi;
module.exports = exports['default'];