import {
  findValue,
  makeObjectFromKeyCollection
} from '../core/util'

const user = {
  identity: 'user',
  connection: 'mysql',
  tableName: 'wp_users',
  /*  types:{
   keyVal: function(){
   if (this.metaCollection){
   return findValue(this.metaCollection, 'first_name')
   }else{
   return ''
   }
   }
   },*/
  attributes: {
    id: {
      type: 'integer',
      columnName: 'ID',
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: 'integer',
      columnName: 'user_nicename',
      defaultsTo: ''
    },
    displayName: {
      type: 'string',
      columnName: 'display_name'
    },
    userName: {
      type: 'string',
      columnName: 'user_login'
    },
    email: {
      type: 'string',
      required: true,
      columnName: 'user_email'
    },
    password: {
      type: 'string',
      required: true,
      columnName: 'user_pass'
    },
    registeredAt: {
      type: 'datetime',
      columnName: 'user_registered'
    },
    status: {
      type: 'integer',
      columnName: 'user_status'
    },
    metaCollection: {
      collection: 'userMeta',
      via: 'userId'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  beforeCreate: (values, next) => {

  },
  beforeUpdate: (values, next) => {

  },
  toJSON: ()=> {
    let obj = this.toObject();
    delete obj.password;
    return obj;
  },
  getMetaAsObject: function(id, cb){
    this
      .findOne()
      .where({id: id})
      .populate('metaCollection')
      .then(userObj => {
        if (userObj.metaCollection) {
          cb(makeObjectFromKeyCollection(userObj.metaCollection))
        } else {
          cb({})
        }
      }, error => {
        console.log('user error', error)
      })
  },
  findMeta: function (id, key, cb) {
    //console.log('findMeta', this)
    this
    .findOne()
      .where({id: id})
      .populate('metaCollection')
      .then(userObj => {
        if (userObj.metaCollection) {
          cb(findValue(userObj.metaCollection, key))
        } else {
          cb('')
        }
      }, error => {
        console.log('user error', error)
      })

  }
}

const userMeta = {
  identity: 'userMeta',
  connection: 'mysql',
  tableName: 'wp_usermeta',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'umeta_id',
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: 'integer',
      columnName: 'user_id',
      model: 'user'
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
  autoUpdatedAt: false,

  beforeCreate: (values, next) => {

  },
  beforeUpdate: (values, next) => {

  }
}

export {user,userMeta}
