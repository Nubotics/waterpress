'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../core/util');

//libs
var hasher = require('wordpress-hash-node');
var slugger = require('slug');

//util


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
    },
    activationKey: {
      type: 'string',
      columnName: 'user_activation_key'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  beforeCreate: function beforeCreate(values, next) {
    /*    if (has(values, 'password')) {
          let hash = hasher.HashPassword(values.password)
          values.password = hash
        }*/
    if ((0, _util.has)(values, 'slug')) {
      var slug = slugger(values.slug);
      values.slug = slug.toLowerCase();
    }

    next(null, values);
  },
  beforeUpdate: function beforeUpdate(values, next) {
    /*    if (has(values, 'password')) {
          let hash = hasher.HashPassword(values.password)
          values.password = hash
        }*/

    next(null, values);
  },
  toJSON: function toJSON() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
  },
  findOneWithMeta: function findOneWithMeta(params, cb) {
    this.findOne().where(params).populate('metaCollection').exec(function (error, userObj) {
      //if (error) throw(error)
      //console.log('user model', userObj)
      if ((0, _util.has)(userObj, 'metaCollection')) {
        var userResult = (0, _util.assign)(userObj, {
          metaObj: (0, _util.makeObject)(userObj.metaCollection)
        });
        delete userResult.password;
        cb(error, userResult);
      } else {
        if (userObj) delete userObj.password;
        cb(error, userObj);
      }
    });
  },
  findWithMeta: function findWithMeta(params, cb) {
    this.find().where(params).populate('metaCollection').exec(function (error, userArr) {
      //if (error) throw(error)
      //console.log('user model find', userArr)
      var result = null;
      if ((0, _util.isArray)(userArr)) {
        result = [];
        (0, _util.forEach)(userArr, function (userObj) {
          if ((0, _util.has)(userObj, 'metaCollection')) {
            var userResult = (0, _util.assign)(userObj, {
              metaObj: (0, _util.makeObject)(userObj.metaCollection)
            });
            delete userResult.password;
            result.push(userResult);
          } else {
            if (userObj) delete userObj.password;
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
        cb(error, (0, _util.findValue)(userObj.metaCollection, key));
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

exports.default = { user: user, userMeta: userMeta };
module.exports = exports['default'];