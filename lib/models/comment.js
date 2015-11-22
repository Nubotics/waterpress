'use strict';

exports.__esModule = true;
var comment = {
  identity: 'comment',
  connection: 'mysql',
  tableName: 'wp_comments',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'comment_ID',
      primaryKey: true,
      autoIncrement: true
    },
    postId: {
      type: 'integer',
      columnName: 'comment_post_ID'
    },
    authorId: {
      type: 'integer',
      columnName: 'comment_author',
      model: 'user'
    },
    authorEmail: {
      type: 'string',
      columnName: 'comment_author_email'
    },
    authorUrl: {
      type: 'string',
      columnName: 'comment_author_url'
    },
    authorIp: {
      type: 'string',
      columnName: 'comment_author_IP'
    },
    createdAt: {
      type: 'datetime',
      columnName: 'comment_date'
    },
    metaCollection: {
      collection: 'commentMeta',
      via: 'comment'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false
};

var commentMeta = {
  identity: 'commentMeta',
  connection: 'mysql',
  tableName: 'wp_commentmeta',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'meta_id',
      primaryKey: true,
      autoIncrement: true
    },
    comment: {
      type: 'integer',
      columnName: 'comment_id',
      model: 'comment'
    },
    key: {
      type: 'string',
      columnName: 'meta_key'
    },
    value: {
      type: 'string',
      columnName: 'meta_value'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false
};

exports['default'] = { comment: comment, commentMeta: commentMeta };
module.exports = exports['default'];
//model:'post'