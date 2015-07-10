import {
  findValue,
  makeObjectFromKeyCollection
} from '../core/util'

const post = {
  identity: 'post',
  connection: 'mysql',
  tableName: 'wp_posts',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'ID',
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: 'integer',
      columnName: 'post_name',
      defaultsTo: ''
    },
    title: {
      type: 'string',
      columnName: 'post_title'
    },
    postType: {
      type: 'string',
      columnName: 'post_type'
    },
    excerpt: {
      type: 'string',
      columnName: 'post_excerpt'
    },
    content: {
      type: 'text',
      columnName: 'post_content'
    },
    status: {
      type: 'string',
      columnName: 'post_status'
    },
    postDate: {
      type: 'datetime',
      columnName: 'post_date'
    },
    updatedAt: {
      type: 'datetime',
      columnName: 'post_modified'
    },
    metaCollection: {
      collection: 'postMeta',
      via: 'postId'
    },
    authorId: {
      type: 'integer',
      columnName: 'post_author',
      model: 'user'
    },
    relationshipCollection: {
      collection: 'termRelationship',
      via: 'objectId'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false

}

const postMeta = {
  identity: 'postMeta',
  connection: 'mysql',
  tableName: 'wp_postmeta',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'meta_id',
      primaryKey: true,
      autoIncrement: true
    },
    postId: {
      type: 'integer',
      columnName: 'post_id',
      model: 'post'
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

export {post, postMeta}
