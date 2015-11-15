//libs
const hasher = require('wordpress-hash-node')
const slugger = require('slug')

//util
import {
  _,
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
      type: 'string',
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
    url: {
      type: 'string',
      columnName: 'user_url'
    },
    metaCollection: {
      collection: 'userMeta',
      via: 'user'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  beforeCreate: (values, next) => {
    if (_.has(values, 'password')) {
      let hash = hasher.HashPassword(values.password)
      values.password = hash
    }
    if (_.has(values, 'slug')) {
      let slug = slugger(values.slug)
      values.slug = slug.toLowerCase()
    }

    next(null, values)

  },
  beforeUpdate: (values, next) => {
    if (_.has(values, 'password')) {
      let hash = hasher.HashPassword(values.password)
      values.password = hash
    }

    next(null, values)

  },
  toJSON: ()=> {
    let obj = this.toObject()
    delete obj.password
    return obj
  },
  findOneWithMeta: function (params, cb) {
    this
      .findOne()
      .where(params)
      .populate('metaCollection')
      .exec((error, userObj) => {
        //if (error) throw(error)
        //console.log('user model', userObj)
        if (_.has(userObj, 'metaCollection')) {
          cb(error,
            _.extend(userObj,
              {metaObj: makeObjectFromKeyCollection(userObj.metaCollection)}
            )
          )
        } else {
          cb(error, userObj)
        }
      })
  },
  findWithMeta: function (params, cb) {
    this
      .find()
      .where(params)
      .populate('metaCollection')
      .exec((error, userArr) => {
        //if (error) throw(error)
        //console.log('user model find', userArr)
        let result = null
        if (_.isArray(userArr)) {
          result = []
          _.forEach(userArr, (userObj)=> {
            if (_.has(userObj, 'metaCollection')) {
              result.push(
                _.extend(userObj,
                  {metaObj: makeObjectFromKeyCollection(userObj.metaCollection)}
                )
              )
            } else {
              result.push(userObj)
            }
          })
        }
        cb(error, result)

      })
  },
  findMeta: function (params, key, cb) {
    //console.log('findMeta', this)
    this
      .findOne()
      .where(params)
      .populate('metaCollection')
      .exec((error, userObj) => {
        if (userObj.metaCollection) {
          cb(error, findValue(userObj.metaCollection, key))
        } else {
          cb(error)
        }
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
    user: {
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
  autoUpdatedAt: false/*,

  beforeCreate: (values, next) => {

  },
  beforeUpdate: (values, next) => {

  }*/
}

export default {user,userMeta}