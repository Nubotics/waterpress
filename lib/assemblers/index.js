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
    }

  }

};

exports['default'] = assemble;
module.exports = exports['default'];