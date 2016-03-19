const comment = {
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
      columnName: 'comment_post_ID',
      model: 'post'
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
}

const commentMeta = {
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
}

export default {
  comment,
  commentMeta
}
