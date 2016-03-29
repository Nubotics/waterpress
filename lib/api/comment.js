'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../core/util');

var _assemblers = require('../assemblers');

var _assemblers2 = _interopRequireDefault(_assemblers);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var populateComment = function populateComment(e, comment, cb, next) {
  var assembleComment = function assembleComment(err, rawComment) {
    var commentSingle = _assemblers2.default.comment.single(rawComment);
    cb(err, commentSingle, next);
  };

  if ((0, _util.has)(comment, 'user') && !(0, _util.is)(comment.user, 'nothing')) {
    var userId = 0;
    if ((0, _util.has)(comment.user, 'id')) {
      userId = comment.user.id;
    } else if ((0, _util.is)(comment.user, 'int')) {
      userId = comment.user;
    }
    if (userId > 0) {
      _user2.default.one.call(this, { id: userId }, function (err, foundUser) {
        if (err) {
          assembleComment(err, comment);
        } else {
          comment.user = foundUser;
          assembleComment(err, comment);
        }
      });
    } else {
      assembleComment(e, comment);
    }
  } else {
    assembleComment(e, comment);
  }
};

//-> api imports
//util

var populateCommentCollection = function populateCommentCollection(e, comments, cb, next) {

  var assembleComments = function assembleComments(err, rawComments) {
    var commentCollection = _assemblers2.default.comment.collection(rawComments);
    cb(err, commentCollection, next);
  };

  var userIdCollection = [];
  (0, _util.forEach)(comments, function (comment) {
    if ((0, _util.has)(comment, 'user')) {
      if (!(0, _util.is)(comment.user, 'nothing')) {
        var userId = 0;
        if ((0, _util.has)(comment.user, 'id')) {
          userId = comment.user.id;
        } else if ((0, _util.is)(comment.user, 'int')) {
          userId = comment.user;
        }
        if (userId > 0) {
          userIdCollection.push(userId);
        }
      }
    }
  });

  if (!(0, _util.is)(userIdCollection, 'zero')) {

    _user2.default.find.call(this, { id: userIdCollection }, function (err, userCollection) {
      if (err) {
        assembleComments(err, comments);
      } else {
        var commentCollection = (0, _util.map)(comments, function (comment) {
          var userId = 0;
          if ((0, _util.has)(comment.user, 'id')) {
            userId = comment.user.id;
          } else if ((0, _util.is)(comment.user, 'int')) {
            userId = comment.user;
          }
          if (userId > 0) {
            var commentUser = (0, _util.find)(userCollection, { id: userId });
            if (!(0, _util.is)(commentUser, 'nothing')) {
              comment.user = commentUser;
            }
          }
          return comment;
        });

        assembleComments(err, commentCollection);
      }
    });
  } else {
    assembleComments(e, comments);
  }
};

//methods
var findComment = function findComment(params, cb, next) {
  var _this = this;

  if (this.collections) {
    this.collections.comment.find().where(params).populate('user').populate('metaCollection').exec(function (err, comments) {
      populateCommentCollection.call(_this, err, comments, cb, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};
var one = function one(params, cb, next) {
  var _this2 = this;

  if (this.collections) {
    this.collections.comment.findOne().where(params).populate('user').populate('metaCollection').exec(function (err, comment) {
      populateComment.call(_this2, err, comment, cb, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};

var save = function save(commentObj, callback, next) {
  var _this3 = this;

  if (this.collections) {
    //-> !has -> post -> error
    if (!(0, _util.has)(commentObj, 'id') && !(0, _util.has)(commentObj, 'postId')) {
      callback('No post supplied', null, next);
    } else
      //-> !has -> user || public author -> error
      if (!(0, _util.has)(commentObj, 'id') && !(0, _util.is)(commentObj.postId, 'int')) {
        callback('No post supplied', null, next);
      } else {
        (function () {

          //-> has -> id -> exists
          var shouldUpdate = function shouldUpdate() {
            return (0, _util.has)(commentObj, 'id') && (0, _util.is)(commentObj.id, 'int');
          };

          var createComment = function createComment(createParams, cb) {
            _this3.collections.comment.create(createParams).exec(cb);
          };

          var updateComment = function updateComment(updateParams, cb) {
            _this3.collections.comment.update({ id: updateParams.id }, updateParams).exec(function (err, updateCollection) {
              if (err) {
                cb(err, null);
              } else {
                var updatedComment = null;
                if (!(0, _util.is)(updateCollection, 'zero')) {
                  updatedComment = updateCollection[0];
                }
                cb(err, updatedComment);
              }
            });
          };

          var reloadComment = function reloadComment(commentId, cb) {
            one.call(_this3, { id: commentId }, function (err, comment) {
              cb(err, comment);
            });
          };

          //::-> run
          if (shouldUpdate()) {
            updateComment(commentObj, function (err, comment) {
              if (err) {
                callback(err, comment, next);
              } else {
                if ((0, _util.has)(comment, 'id')) {
                  reloadComment(comment.id, function (err, freshComment) {
                    callback(err, freshComment, next);
                  });
                } else {
                  callback(err, comment, next);
                }
              }
            });
          } else {
            createComment(commentObj, function (err, newComment) {
              if (err) {
                callback(err, newComment, next);
              } else {
                if ((0, _util.has)(newComment, 'id')) {
                  reloadComment(newComment.id, function (err, reloadComment) {
                    callback(err, reloadComment, next);
                  });
                } else {
                  callback(err, newComment, next);
                }
              }
            });
          }
        })();
      }
  } else {
    callback('Not connected', null, next);
  }
};
var kill = function kill(commentId, cb, next) {
  if (this.collections) {
    this.collections.comment.destroy({ id: commentId }).exec(function (err, result) {
      cb(err, result, next);
    });
  } else {
    cb('Not connected', null, next);
  }
};

//api export
exports.default = {
  find: findComment,
  one: one,
  save: save,
  kill: kill
};
module.exports = exports['default'];