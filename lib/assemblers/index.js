//util
'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

var assemble = {
  user: {
    entity: function entity(user) {
      if (user) {
        user.firstName = '';
        user.lastName = '';
        user.nickname = '';
        user.description = '';
        if (_coreUtil.has(user, 'password')) {
          delete user.password;
        }
        if (_coreUtil.has(user, 'metaObj')) {
          if (_coreUtil.has(user.metaObj, 'first_name')) user.firstName = user.metaObj.first_name;
          if (_coreUtil.has(user.metaObj, 'last_name')) user.lastName = user.metaObj.last_name;
          if (_coreUtil.has(user.metaObj, 'nickname')) user.nickname = user.metaObj.nickname;
          if (_coreUtil.has(user.metaObj, 'description')) user.description = user.metaObj.description;
          if (_coreUtil.has(user.metaObj, 'mobile')) user.mobile = user.metaObj.mobile;
          if (_coreUtil.has(user.metaObj, 'nio_profile_picture')) {
            user.avatar = user.metaObj.nio_profile_picture;
          } else if (_coreUtil.has(user.metaObj, 'cupp_upload_meta')) {
            user.avatar = user.metaObj.cupp_upload_meta;
          }
          return user;
        } else {
          return user;
        }
      } else {
        return user;
      }
    }
  },
  category: {
    top: function top(item, collection, activityCollection) {
      var category = {
        termId: item.term.id,
        taxonomyId: item.id,
        parent: item.parent,
        name: item.term.name,
        slug: item.term.slug
      };
      var subCollection = [];
      var foundChild = null;
      if (item.childCollection.length > 0) {
        item.childCollection.map(function (childItem) {
          foundChild = _coreUtil._.find(collection, { 'id': childItem.id });
          if (foundChild) {
            subCollection.push(assemble.category.entity(foundChild, activityCollection, false));
          }
        });
      } else {
        var childCollection = _coreUtil._.filter(collection, { parent: category.termId });
        if (childCollection) {
          childCollection.map(function (childItem) {
            subCollection.push(assemble.category.entity(childItem, activityCollection, false));
          });
        }
      }
      category.subCollection = subCollection;
      return category;
    },
    entity: function entity(item, activityCollection, isFlat) {
      var result = {
        termId: item.term.id,
        taxonomyId: item.id,
        parent: item.parent,
        name: item.term.name,
        slug: item.term.slug,
        isFollowed: false
      };
      if (!isFlat) {
        result = _coreUtil._.extend(result, { subCollection: item.subCollection });
      }
      if (activityCollection) {
        var currFollow = _coreUtil._.find(activityCollection, { following_term_id: item.termId });
        if (currFollow) {
          result.isFollowed = true;
        }
      }
      return result;
    },
    collection: function collection(_collection, activityCollection, isFlat) {

      var result = [];
      _collection.map(function (item) {
        if (!isFlat) {
          if (item.parent == 0) {
            result.push(assemble.category.top(item, _collection, activityCollection));
          }
        } else {
          result.push(assemble.category.entity(item, activityCollection, isFlat));
        }
      });
      result = _coreUtil._.sortBy(result, 'name');
      return result;
    },
    flatCollection: function flatCollection(categoryCollection, activityCollection) {
      var result = category.collection(categoryCollection, activityCollection, true);
      return result;
    },
    detailCollection: function detailCollection(collection, _detailCollection) {
      var newCollection = [];
      var newItem = undefined;
      var newChildCollection = [];
      var newChildItem = undefined;
      var detailItem = undefined;
      var detailChildItem = undefined;
      _coreUtil.forEach(collection, function (ogItem) {
        //-> find ogItem in detail collection
        detailItem = _coreUtil._.find(_detailCollection, { id: ogItem.id });
        if (detailItem) {
          //-> if -> has -> childCollection
          if (_coreUtil.has(ogItem, 'childCollection') && _coreUtil.has(detailItem, 'childCollection')) {
            //--> each child -> merge ->  new child item
            newChildCollection = [];
            _coreUtil.forEach(ogItem.childCollection, function (ogChildItem) {
              detailChildItem = _coreUtil._.find(detailItem.childCollection, { id: ogChildItem.term });
              if (detailChildItem) {
                newChildItem = _coreUtil.merge(detailChildItem, ogChildItem);
              } else {
                newChildItem = ogChildItem;
              }
              newChildCollection.push(newChildItem);
            });
          }
          var id = ogItem.id;
          var description = ogItem.description;
          var taxonomy = ogItem.taxonomy;
          var _parent = ogItem.parent;
          var slug = detailItem.slug;
          var _name = detailItem.name;
          var group = detailItem.group;

          newItem = {
            id: id,
            slug: slug,
            name: _name,
            description: description,
            taxonomy: taxonomy,
            parent: _parent,
            group: group,
            childCollection: newChildCollection
          };
          //-> push new item to new collection
          newCollection.push(newItem);
        }
        //-> else &&
      });
      //-> return
      return newCollection;
    }
  }

};

exports['default'] = assemble;
module.exports = exports['default'];