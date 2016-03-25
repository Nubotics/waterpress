//util
import {

  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObject,
  merge,

} from '../core/util'

import assembler from '../assemblers'

let populateComment = function (e, comment, cb, next) {
  let commentSingle = assembler.comment.single(comment)
  cb(e, commentSingle, next)
}
let populateCommentCollection = function (e, comments, cb, next) {
  let commentCollection = assembler.comment.collection(comments)
  cb(e, commentCollection, next)
}

//methods
let find = function (params, cb, next) {
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

let save = function (commentObj, cb, next) {
  if (this.collections) {
    //-> !has -> post -> error
    if (!has(commentObj, 'postId')) {
      callback('No post supplied', null, next)
    } else
    //-> !has -> user || public author -> error
    if (!is(commentObj.postId, 'int')) {
      callback('No postr supplied', null, next)
    } else {

      //-> has -> id -> exists
      const shouldUpdate = ()=> {
        return has(postObj, 'id') && is(postObj.id, 'int')
      }

      const createComment = (createParams, cb) => {

      }

      const updateComment = (updateParams, cb) => {

      }

      const reloadComment = (commentId, cb)=>{
        
      }

      //-> has -> id -> update

      //-> else -> create

    }
  } else {
    cb('Not connected', null, next)
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
  find,
  one,
  save,
  kill,
}
