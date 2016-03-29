'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../core/util');

var assemble = {
  user: {
    entity: function entity(user) {
      if (user) {
        user.firstName = '';
        user.lastName = '';
        user.nickname = '';
        user.description = '';
        if ((0, _util.has)(user, 'password')) {
          delete user.password;
        }
        if ((0, _util.has)(user, 'metaObj')) {
          if ((0, _util.has)(user.metaObj, 'first_name')) user.firstName = user.metaObj.first_name;
          if ((0, _util.has)(user.metaObj, 'last_name')) user.lastName = user.metaObj.last_name;
          if ((0, _util.has)(user.metaObj, 'nickname')) user.nickname = user.metaObj.nickname;
          if ((0, _util.has)(user.metaObj, 'description')) user.description = user.metaObj.description;
          if ((0, _util.has)(user.metaObj, 'mobile')) user.mobile = user.metaObj.mobile;
          if ((0, _util.has)(user.metaObj, 'nio_avatar')) {
            user.avatar = user.metaObj.nio_avatar;
          } else if ((0, _util.has)(user.metaObj, 'cupp_upload_meta')) {
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
          foundChild = (0, _util.find)(collection, { 'id': childItem.id });
          if (foundChild) {
            subCollection.push(assemble.category.entity(foundChild, activityCollection, false));
          }
        });
      } else {
        var childCollection = (0, _util.filter)(collection, { parent: category.termId });
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
        result = (0, _util.merge)(result, { subCollection: item.subCollection });
      }
      if (activityCollection) {
        var currFollow = (0, _util.find)(activityCollection, { following_term_id: item.termId });
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
      result = (0, _util.sortBy)(result, 'name');
      return result;
    },
    flatCollection: function flatCollection(categoryCollection, activityCollection) {
      var result = category.collection(categoryCollection, activityCollection, true);
      return result;
    },
    detailCollection: function detailCollection(collection, termCollection) {

      //console.log('assembler -> category -> detailCollection -> collection, termCollection', collection, termCollection)

      var newCollection = [];
      var newItem = undefined;
      var newChildCollection = [];
      var newChildItem = undefined;
      var termItem = undefined;
      var detailChildItem = undefined;

      (0, _util.forEach)(collection, function (ogItem) {

        //-> find ogItem in term collection
        termItem = (0, _util.find)(termCollection, { id: ogItem.term.id });
        if (termItem) {
          newChildCollection = [];

          //-> if -> has -> childCollection
          if ((0, _util.has)(ogItem, 'childCollection') && (0, _util.has)(termItem, 'childCollection')) {

            //--> each child -> merge ->  new child item
            (0, _util.forEach)(ogItem.childCollection, function (ogChildItem) {
              if (!ogChildItemTermId) ogChildItemTermId = 0;
              detailChildItem = (0, _util.find)(termItem.childCollection, { id: ogChildItem.id });
              if (detailChildItem) {
                newChildItem = (0, _util.merge)(detailChildItem, ogChildItem);
              } else {
                newChildItem = ogChildItem;
              }
              newChildCollection.push(newChildItem);
            });
          }

          var id = ogItem.id;
          var description = ogItem.description;
          var taxonomy = ogItem.taxonomy;
          var parent = ogItem.parent;
          var _termItem = termItem;
          var slug = _termItem.slug;
          var name = _termItem.name;
          var group = _termItem.group;


          newItem = {
            id: termItem.id,
            taxonomyId: id,
            slug: slug,
            name: name,
            description: description,
            taxonomy: taxonomy,
            parent: parent,
            group: group,
            childCollection: newChildCollection
          };
          //-> push new item to new collection
          newCollection.push(newItem);
        }
        //-> else &&
        else {
            newCollection.push(ogItem);
          }
      });
      //-> return
      console.log('assembler -> category -> return -> newCollection', newCollection);

      return newCollection;
    },
    collectionWithChildren: function collectionWithChildren(collection) {
      var newCollection = [];
      var newItem = {};
      (0, _util.forEach)(collection, function (item) {
        var term = item.term;
        var taxonomy = item.taxonomy;
        var description = item.description;
        var parent = item.parent;
        var id = item.id;
        var childCollection = item.childCollection;
        var slug = term.slug;
        var name = term.name;
        var group = term.group;


        newItem = {
          id: term.id,
          taxonomyId: id,
          slug: slug,
          name: name,
          group: group,
          description: description,
          taxonomy: taxonomy,
          parent: parent,
          childCollection: childCollection
        };
        newCollection.push(newItem);
      });
      return newCollection;
    }
  },
  comment: {
    single: function single(comment) {
      if ((0, _util.has)(comment, 'metaCollection')) {
        comment.metaObj = (0, _util.makeObject)(comment.metaCollection);
      }
      return comment;
    },
    collection: function collection(commentCollection) {
      var collection = [];
      (0, _util.forEach)(commentCollection, function (comment) {
        collection.push(assemble.comment.single(comment));
      });
      return collection;
    }
  }
}; //util


exports.default = assemble;
module.exports = exports['default'];