//util
import {
  is,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObject,
  merge,
  pluck,
  find,
  map,
} from '../core/util'

import assembler from '../assemblers'

//-> api imports
import userApi from './user'

let populateComment = function (e, comment, cb, next) {
  const assembleComment = (err, rawComment)=> {
    let commentSingle = assembler.comment.single(rawComment)
    cb(err, commentSingle, next)
  }

  if (has(comment, 'user') && !is(comment.user, 'nothing')) {
    let userId = 0
    if (has(comment.user, 'id')) {
      userId = comment.user.id
    } else if (is(comment.user, 'int')) {
      userId = comment.user
    }
    if (userId > 0) {
      userApi.one.call(this, {id: userId}, function (err, foundUser) {
        if (err) {
          assembleComment(err, comment)
        } else {
          comment.user = foundUser
          assembleComment(err, comment)
        }
      })
    } else {
      assembleComment(e, comment)
    }
  } else {
    assembleComment(e, comment)
  }

}
let populateCommentCollection = function (e, comments, cb, next) {

  const assembleComments = (err, rawComments)=> {
    let commentCollection = assembler.comment.collection(rawComments)
    cb(err, commentCollection, next)
  }


  let userIdCollection =[]
  forEach(comments, comment=> {
    if (has(comment, 'user')) {
      if (!is(comment.user, 'nothing')) {
        let userId = 0
        if (has(comment.user, 'id')) {
          userId = comment.user.id
        } else if (is(comment.user, 'int')) {
          userId = comment.user
        }
        if (userId > 0) {
          userIdCollection.push( userId)
        }
      }
    }
  })

  if (!is(userIdCollection, 'zero')) {

    userApi.find.call(this, {id: userIdCollection}, function (err, userCollection) {
      if (err) {
        assembleComments(err, comments)
      } else {
        let commentCollection = map(comments, comment=> {
          let userId = 0
          if (has(comment.user, 'id')) {
            userId = comment.user.id
          } else if (is(comment.user, 'int')) {
            userId = comment.user
          }
          if (userId > 0) {
            let commentUser = find(userCollection, {id: userId})
            if (!is(commentUser, 'nothing')) {
              comment.user = commentUser
            }
          }
          return comment
        })

        assembleComments(err, commentCollection)
      }
    })
  } else {
    assembleComments(e, comments)
  }

}

//methods
let findComment = function (params, cb, next) {
  if (this.collections) {
    this.collections
      .comment
      .find()
      .where(params)
      .populate('user')
      .populate('metaCollection')
      .exec((err, comments)=> {
        populateCommentCollection.call(this, err, comments, cb, next)
      })
  } else {
    cb('Not connected', null, next)
  }
}
let one = function (params, cb, next) {
  if (this.collections) {
    this.collections
      .comment
      .findOne()
      .where(params)
      .populate('user')
      .populate('metaCollection')
      .exec((err, comment)=> {
        populateComment.call(this, err, comment, cb, next)

      })
  } else {
    cb('Not connected', null, next)
  }
}

let save = function (commentObj, callback, next) {
  if (this.collections) {
    //-> !has -> post -> error
    if (!has(commentObj, 'postId')) {
      callback('No post supplied', null, next)
    } else
    //-> !has -> user || public author -> error
    if (!is(commentObj.postId, 'int')) {
      callback('No post supplied', null, next)
    } else {

      //-> has -> id -> exists
      const shouldUpdate = ()=> {
        return has(commentObj, 'id') && is(commentObj.id, 'int')
      }

      const createComment = (createParams, cb) => {
        this.collections
          .comment
          .create(createParams)
          .exec(cb)
      }

      const updateComment = (updateParams, cb) => {
        this.collections
          .comment
          .update({id: updateParams.id}, updateParams)
          .exec((err, updateCollection)=> {
            if (err) {
              cb(err, null)
            } else {
              let updatedComment = null
              if (!is(updateCollection, 'zero')) {
                updatedComment = updateCollection[0]
              }
              cb(err, updatedComment)
            }
          })
      }

      const reloadComment = (commentId, cb)=> {
        one.call(this, {id: commentId}, function (err, comment) {
          cb(err, comment)
        })
      }

      //::-> run
      if (shouldUpdate()) {
        updateComment(commentObj, (err, comment)=> {
          if (err) {
            callback(err, comment, next)
          } else {
            if (has(post, 'id')) {
              reloadComment(comment.id, (err, freshComment)=> {
                callback(err, freshComment, next)
              })
            } else {
              callback(err, comment, next)
            }
          }
        })
      } else {
        createComment(commentObj, (err, newComment)=> {
          if (err) {
            callback(err, newComment, next)
          } else {
            if (has(newComment, 'id')) {
              reloadComment(newComment.id, (err, reloadComment)=> {
                callback(err, reloadComment, next)
              })
            } else {
              callback(err, newComment, next)
            }
          }
        })
      }

    }
  } else {
    callback('Not connected', null, next)
  }
}
let kill = function (commentId, cb, next) {
  if (this.collections) {
    this.collections
      .comment
      .destroy({id: commentId})
      .exec((err, result)=> {
        cb(err, result, next)
      })
  } else {
    cb('Not connected', null, next)
  }
}

//api export
export default {
  find: findComment,
  one,
  save,
  kill,
}
