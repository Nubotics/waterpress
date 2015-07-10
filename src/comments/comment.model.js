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
    postId:{
      type:'integer',
      columnName:'comment_post_ID',
      model:'post'
    },
    authorId:{
      type:'integer',
      columnName:'comment_author',
      model:'user'
    },
    authorEmail: {
      type: 'string',
      columnName: 'comment_author_email'
    },
    authorUrl:{
      type: 'string',
      columnName: 'comment_author_url'
    },
    authorIp:{
      type: 'string',
      columnName: 'comment_author_IP'
    },
    createdAt:{
      type: 'datetime',
      columnName: 'comment_date'
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
  attributes: {},
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false
}

export {comment,commentMeta}
