//create models
const bookmark = {
  identity: 'bookmark',
  //connection: 'mongo',
  connection: 'mysql',
  tableName:'nio_bookmark',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    post: {
      type: 'integer',
      required: true,
      model: 'post'
    },
    order: {
      type: 'integer'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
}

const curation = {
  identity: 'curation',
  //connection: 'mongo',
  connection: 'mysql',
  tableName:'nio_curation',

  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    title: {
      type: 'string',
      required: true
    },
    tags: {
      type: 'json'
    },
    description: {
      type: 'string'
    }

  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
}

const curationBookmark = {
  identity: 'curationBookmark',
  //connection: 'mongo',
  connection: 'mysql',
  tableName:'nio_curationBookmark',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    curation: {
      type: 'integer',
      required: true,
      model: 'curation'
    },
    bookmark: {
      type: 'integer',
      required: true,
      model: 'bookmark'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
}

const following = {
  identity: 'following',
  //connection: 'mongo',
  connection: 'mysql',
  tableName:'nio_following',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    followUser: {
      columnName:'follow_user',
      type: 'integer',
      model: 'user'
    },
    followTerm: {
      columnName:'follow_term',
      type: 'integer',
      model: 'term'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
}

const like = {
  identity: 'like',
  //connection: 'mongo',
  connection: 'mysql',
  tableName:'nio_like',

  attributes:{
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user:{
      type:'integer',
      required:true,
      model:'user'
    },
    post:{
      type:'integer',
      required:true,
      model:'post'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
}

const passport = {
  identity: 'passport',
  connection: 'mysql',
  tableName: 'nio_passport',
  attributes:{
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user:{
      type:'integer',
      //required:true,
      model:'user'
    },
    protocol:{
      type:'alphanumeric',
      //required:true
    },
    provider: {
      type: 'alphanumericdashed'
    },
    identifier: {
      type: 'string'
    },
    tokens: {
      type: 'json'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
}

const read = {
  identity: 'read',
  //connection: 'mongo',
  connection: 'mysql',
  tableName:'nio_read',

  attributes:{
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user:{
      type:'integer',
      required:true,
      model:'user'
    },
    post:{
      type:'integer',
      required:true,
      model:'post'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
}

const settings = {

}

const share = {
  identity: 'share',
  //connection: 'mongo',
  connection: 'mysql',
  tableName:'nio_share',

  attributes:{
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user:{
      type:'integer',
      required:true,
      model:'user'
    },
    post:{
      type:'integer',
      required:false,
      model:'post'
    },
    url: {
      type: 'string'
    },
    provider: {
      type: 'alphanumericdashed'
    },
    responseId:{
      type:'string'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
}

export default {
  bookmark,
  curation,
  curationBookmark,
  following,
  like,
  passport,
  read,
  settings,
  share,

}
