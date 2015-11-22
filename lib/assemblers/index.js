'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _striptags = require('striptags');

var _striptags2 = _interopRequireDefault(_striptags);

var _htmlTruncate = require('html-truncate');

var _htmlTruncate2 = _interopRequireDefault(_htmlTruncate);

//util

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

  },
  profile: {
    entity: function entity(profile, activityCollection) {

      var result = {
        id: profile.id,
        slug: profile.slug,
        displayName: '',
        firstName: '',
        lastName: '',
        mobile: '',
        avatar: '',
        followCount: 0,
        isFollowed: false,
        description: ''
      };

      if (_coreUtil._.has(profile, 'firstName')) {
        result.firstName = profile.firstName;
        result.displayName = profile.firstName;
      }

      if (_coreUtil._.has(profile, 'lastName')) {
        result.lastName = profile.lastName;
        result.displayName += ' ' + profile.lastName;
      }

      if (_coreUtil._.has(profile, 'description')) {
        result.description = profile.description;
      }

      if (_coreUtil._.has(profile, 'metaObj')) {

        if (_coreUtil._.has(profile.metaObj, 'nio_profile_picture')) {
          result.avatar = profile.metaObj.nio_profile_picture;
        } else if (_coreUtil._.has(profile.metaObj, 'cupp_upload_meta')) {
          result.avatar = profile.metaObj.cupp_upload_meta;
        } else if (_coreUtil._.has(profile.metaObj, 'profile_picture')) {
          result.avatar = profile.metaObj.profile_picture;
        }

        if (result.displayName.length === 0) {
          if (_coreUtil._.has(profile.metaObj, 'first_name')) {
            result.firstName = profile.metaObj.first_name;
            result.displayName = profile.metaObj.first_name;
          }
          if (_coreUtil._.has(profile.metaObj, 'last_name')) {
            result.lastName = profile.metaObj.last_name;
            result.displayName += ' ' + profile.metaObj.last_name;
          }
        }

        if (result.description.length === 0) {
          if (_coreUtil._.has(profile.metaObj, 'description')) {
            result.description = profile.metaObj.description;
          }
        }

        if (_coreUtil._.has(profile.metaObj, 'mobile')) {
          profile.mobile = profile.metaObj.mobile;
        }
      }

      if (result.description.length === 0) {
        result.firstName = profile.displayName;
        result.displayName = profile.displayName;
      }

      if (_coreUtil._.has(profile, 'followersCollection')) {
        if (profile.followersCollection) {
          if (_coreUtil._.isArray(profile.followersCollection)) {
            result.followCount = profile.followersCollection.length;
          }
        }
      }

      if (activityCollection) {
        var currFollow = _coreUtil._.find(activityCollection, { following_user_id: result.id });
        if (currFollow) {
          result.isFollowed = true;
        }
      }

      return result;
    }
  },
  story: {
    makeExcerpt: function makeExcerpt(content) {
      var result = _striptags2['default'](content);
      result = _htmlTruncate2['default'](result, 100);
      return result;
    },
    findPostCategory: function findPostCategory(rel, categoryCollection) {
      var collection = [];

      var result = _coreUtil._.filter(categoryCollection, { 'taxonomyId': rel.termTaxonomy });
      //console.log('FIND CATEGORY', result)
      if (result) {
        if (_coreUtil._.isArray(result)) {
          collection = collection.concat(result);
        } else {
          collection = collection.push(result);
        }
      }
      categoryCollection.map(function (cat) {
        if (_coreUtil._.has(cat, 'subCollection')) {
          result = _coreUtil._.filter(cat.subCollection, { 'taxonomyId': rel.termTaxonomy });
          //console.log('FIND CATEGORY subCollection', result)
          if (result) {
            if (_coreUtil._.isArray(result)) {
              collection = collection.concat(result);
            } else {
              collection = collection.push(result);
            }
          }
        }
      });

      //console.log('FIND CATEGORY',rel, categoryCollection, collection)

      return collection;
    },
    entity: function entity(post, attachmentCollection, formatCollection, userCollection, postCounts, activityCollection) {
      //console.log('ASSEMBLE STORY', post)
      var author = null;
      if (_coreUtil._.has(post.author, 'id')) {
        author = _coreUtil._.find(userCollection, { id: post.author.id });
        //console.log('FIND AUTHOR', post.author, author, userCollection)
        if (!author) author = post.author;
      }

      var likes = 0;
      var isLiked = false;
      var bookmarks = 0;
      var isBookmarked = false;
      var shares = 0;
      var trendingScore = 0;

      if (postCounts) {
        postCounts.map(function (count) {
          if (count.likeCount) likes = count.likeCount;
          if (count.bookmarkCount) bookmarks = count.bookmarkCount;
          if (count.shareCount) shares = count.shareCount;
        });

        trendingScore = likes + bookmarks + shares;
      }

      var postFormat = '';
      var currFormat = null;
      if (_coreUtil._.has(post, 'relationshipCollection')) {
        //if (post.title == 'gallery') console.log('gallery relationships', post.relationshipCollection)
        _coreUtil._.forEach(post.relationshipCollection, function (relationship) {
          currFormat = _coreUtil._.find(formatCollection, { taxonomyId: relationship.termTaxonomy });
          if (currFormat) {
            postFormat = currFormat.slug;
            return false;
          }
        });
      }
      if (activityCollection) {
        var currBookmark = null;
        var currLike = null;
        var currFollow = null;

        currBookmark = _coreUtil._.find(activityCollection, { bookmark_post_id: post.id });
        if (currBookmark) {
          isBookmarked = true;
        }

        currLike = _coreUtil._.find(activityCollection, { like_post_id: post.id });
        if (currLike) {
          isLiked = true;
        }

        if (author) {
          currFollow = _coreUtil._.find(activityCollection, { following_user_id: author.id });
          if (currFollow) {
            author.isFollowed = true;
          }
        }
      }

      var story = {
        //straight map
        id: post.id,
        slug: post.slug,
        title: post.title,
        postType: post.postType,
        excerpt: assemble.story.makeExcerpt(post.content),
        content: post.content,
        featuredImage: {},
        status: post.status,
        postDate: post.postDate,
        updatedAt: post.updatedAt,
        author: author,
        categoryCollection: post.categoryCollection,
        metaObj: makeObject(post.metaCollection),
        likes: likes,
        bookmarks: bookmarks,
        shares: shares,
        trendingScore: trendingScore,
        isBookmarked: isBookmarked,
        isLiked: isLiked,
        latestActivityName: '',
        postFormat: postFormat
      };

      if (_coreUtil._.has(story.metaObj, '_thumbnail_id')) {
        var featureImg = _coreUtil._.find(attachmentCollection, { 'id': parseInt(story.metaObj._thumbnail_id) });
        if (featureImg) {
          story.featuredImage = {
            id: featureImg.id,
            url: featureImg.guid,
            mimeType: featureImg.mimeType
          };
        }
      }

      return story;
    },
    collection: function collection(postCollection, attachmentCollection, formatCollection, categoryCollection, userCollection, activityCounts, activityCollection) {
      var storyCollection = [];
      var currCat = null;
      var postCounts = null;
      postCollection.map(function (post) {

        var catCollection = [];

        if (_coreUtil._.has(post, 'relationshipCollection')) {
          post.relationshipCollection.map(function (rel) {

            currCat = assemble.story.findPostCategory(rel, categoryCollection);
            //console.log('CURRENT CAT', currCat)
            if (currCat) {
              if (_coreUtil._.isArray(currCat)) {
                catCollection = catCollection.concat(currCat);
              } else {
                catCollection.push(currCat);
              }
            }
          });
        }

        postCounts = _coreUtil._.filter(activityCounts, { 'ID': post.id });

        post.categoryCollection = catCollection;

        storyCollection.push(assemble.story.entity(post, attachmentCollection, formatCollection, userCollection, postCounts, activityCollection));
      });

      return storyCollection;
    }

  }

};

exports['default'] = assemble;
module.exports = exports['default'];