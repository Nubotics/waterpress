'use strict';

exports.__esModule = true;

var _coreUtil = require('../core/util');

var hasher = require('wordpress-hash-node');
var slugger = require('slug');

var user = {
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

  beforeCreate: function beforeCreate(values, next) {
    if (_coreUtil._.has(values, 'password')) {
      var hash = hasher.HashPassword(values.password);
      values.password = hash;
    }
    if (_coreUtil._.has(values, 'slug')) {
      var slug = slugger(values.slug);
      values.slug = slug.toLowerCase();
    }

    next(null, values);
  },
  beforeUpdate: function beforeUpdate(values, next) {
    if (_coreUtil._.has(values, 'password')) {
      var hash = hasher.HashPassword(values.password);
      values.password = hash;
    }

    next(null, values);
  },
  toJSON: function toJSON() {
    var obj = undefined.toObject();
    delete obj.password;
    return obj;
  },
  findOneWithMeta: function findOneWithMeta(params, cb) {
    this.findOne().where(params).populate('metaCollection').exec(function (error, userObj) {
      //if (error) throw(error)
      //console.log('user model', userObj)
      if (_coreUtil._.has(userObj, 'metaCollection')) {
        cb(error, _coreUtil._.extend(userObj, { metaObj: _coreUtil.makeObjectFromKeyCollection(userObj.metaCollection) }));
      } else {
        cb(error, userObj);
      }
    });
  },
  findWithMeta: function findWithMeta(params, cb) {
    this.find().where(params).populate('metaCollection').exec(function (error, userArr) {
      //if (error) throw(error)
      console.log('user model find', userArr);
      var result = null;
      if (_coreUtil._.isArray(userArr)) {
        result = [];
        _coreUtil._.forEach(userArr, function (userObj) {
          if (_coreUtil._.has(userObj, 'metaCollection')) {
            result.push(_coreUtil._.extend(userObj, { metaObj: _coreUtil.makeObjectFromKeyCollection(userObj.metaCollection) }));
          } else {
            result.push(userObj);
          }
        });
      }
      cb(error, result);
    });
  },
  findMeta: function findMeta(params, key, cb) {
    //console.log('findMeta', this)
    this.findOne().where(params).populate('metaCollection').exec(function (error, userObj) {
      if (userObj.metaCollection) {
        cb(error, _coreUtil.findValue(userObj.metaCollection, key));
      } else {
        cb(error);
      }
    });
  }
};

var userMeta = {
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
  autoUpdatedAt: false /*,
                       beforeCreate: (values, next) => {
                       },
                       beforeUpdate: (values, next) => {
                       }*/
};

exports.user = user;
exports.userMeta = userMeta;