//util
'use strict';

exports.__esModule = true;

var _addons = require('../../../addons');

var _ = _addons.pluginUtils._;
var assign = _addons.pluginUtils.assign;
var eachKey = _addons.pluginUtils.eachKey;
var findValue = _addons.pluginUtils.findValue;
var forEach = _addons.pluginUtils.forEach;
var has = _addons.pluginUtils.has;
var makeObjectFromKeyCollection = _addons.pluginUtils.makeObjectFromKeyCollection;
var merge = _addons.pluginUtils.merge;

//alias
var makeObj = makeObjectFromKeyCollection;

//main
var assemble = {
  category: {
    top: function top(item, collection, termMetaCollection, activityCollection) {
      var foundTermMeta = _.filter(termMetaCollection, { term: item.term.id });
      var category = {
        termId: item.term.id,
        taxonomyId: item.id,
        parent: item.parent,
        name: item.term.name,
        slug: item.term.slug,
        metaObj: makeObj(foundTermMeta)
      };
      var subCollection = [];
      var foundChild = null;
      if (item.childCollection.length > 0) {
        item.childCollection.map(function (childItem) {
          foundChild = _.find(collection, { 'id': childItem.id });
          if (foundChild) {
            subCollection.push(assemble.category.entity(foundChild, null, activityCollection, false));
          }
        });
      } else {
        var childCollection = _.filter(collection, { parent: category.termId });
        if (childCollection) {
          childCollection.map(function (childItem) {
            subCollection.push(assemble.category.entity(childItem, null, activityCollection, false));
          });
        }
      }
      category.subCollection = subCollection;
      return category;
    },
    entity: function entity(item, termMetaCollection, activityCollection, isFlat) {
      var result = {
        termId: item.term.id,
        taxonomyId: item.id,
        parent: item.parent,
        name: item.term.name,
        slug: item.term.slug,
        isFollowed: false
      };
      if (termMetaCollection) {
        var foundTermMeta = _.filter(termMetaCollection, { term: item.term.id });
        result = _.extend(result, { metaObj: makeObj(foundTermMeta) });
      }
      if (!isFlat) {
        if (has(item, 'subCollection')) {
          result = _.extend(result, { subCollection: item.subCollection });
        }
      }
      if (activityCollection) {
        var currFollow = _.find(activityCollection, { following_term_id: item.termId });
        if (currFollow) {
          result.isFollowed = true;
        }
      }
      return result;
    },
    collection: function collection(_collection, termMetaCollection, activityCollection, isFlat) {
      var result = [];
      _collection.map(function (item) {
        if (!isFlat) {
          if (item.parent == 0) {
            result.push(assemble.category.top(item, _collection, termMetaCollection));
          }
        } else {
          result.push(assemble.category.entity(item, termMetaCollection, activityCollection, isFlat));
        }
      });
      result = _.sortBy(result, 'name');
      return result;
    }
  }
};

exports['default'] = assemble;
module.exports = exports['default'];