//util
import {
  _,
  has,
  assign,
  forEach,
  merge,
  eachKey,
  findValue,

} from '../core/util'

export default {
  one(params, cb, next){
    if (this.collections) {
      this.collections
        .user
        .findOneWithMeta(params, (err, user)=> {
          cb(err, user, next)
        })
    } else {
      cb('Not connected', null, next)
    }
  },
  find(params, cb, next){
    if (this.collections) {
      this.collections
        .user
        .findWithMeta(params, (e, userArr)=> {
          cb(e, userArr, next)
        })
    } else {
      cb('Not connected', null, next)
    }
  },
  byRole(roleName, cb, next){
    if (this.collections) {
      this.collections
        .usermeta
        .find()
        .where({key: 'wp_capabilities', value: {'contains': roleName}})
        .exec((err, meta)=> {
          let userIdArr = []
          if (meta) {
            meta.map((item)=> {
              //console.log('item', item.userId)
              userIdArr.push(item.user)
            })
            this.collections
              .user
              .findWithMeta(params, (e, userArr)=> {
                cb(e, userArr, next)
              })

          } else {

            cb(err, null, next)

          }

        })

    } else {
      cb('Not connected', null, next)
    }
  },
  existsByEmail(email, cb){
    if (this.collections) {

    } else {
      cb('Not connected', null, next)
    }
  },
  save(userObj, chainStart, chainEnd, cb){
    if (this.collections) {

    } else {
      cb('Not connected', null, next)
    }
  },
  login(identifier, password, cb){
    if (this.collections) {

    } else {
      cb('Not connected', null, next)
    }
  },
}
