import {_} from '../core/util'
let userApi = {
  one(params, cb){
    //console.log('one checking state', this.collections)
    this.safeConnect((error, collections)=> {
      if (error) throw(error)

      collections.user
        .findOneWithMeta(params, (err, user)=> {
          this.safeKill(()=> {
            cb(err, user)
          })
        })

    })

  },
  find(params, cb){
    this.safeConnect((error, collections)=> {
      if (error) throw(error)

      collections.user
        .findWithMeta(params, (e, userArr)=> {
          this.safeKill(()=> {
            cb(e, userArr)
          })
        })

    })

  },
  byRole(groupName, cb){
    this.safeConnect((error, collections)=> {
      if (error) throw(error)

      collections.usermeta
        .find()
        .where({key: 'wp_capabilities', value: {'contains': groupName}})
        .exec((err, meta)=> {
          let userIdArr = []
          if (meta) {

            meta.map((item)=> {
              //console.log('item', item.userId)
              userIdArr.push(item.userId)
            })

            this.safeKill(()=> {
              console.log('map is sync', this.user.find)
              this.user.find({id: userIdArr}, cb)
            })


          } else {

            this.safeKill(()=> {
              cb(err, null)
            })

          }
        })

    })

  },
  existsByEmail(email, cb){
    this.safeConnect((error, collections)=> {
      this.user.one({email}, (err, user)=> {
        this.safeKill(()=> {
          if (user) {
            cb(err, true)
          } else {
            cb(err, false)
          }
        })
      })
    })
  },
  save(userObj, cb){
    //TODO: santiize userObj
    this.safeConnect((error, collections)=> {
      collections.user
        .one({email: userObj.email}, (err, user)=> {
          if (user) {

            collections.user
              .update({id: userObj.id}, userObj)
              .exec((e, users)=> {
                //TODO: validate the response before callback
                this.safeKill(()=> {
                  cb(e, users[0])
                })
              })

          } else {

            collections.user
              .create(userObj)
              .exec((e, user)=> {
                //TODO: validate the response before callback
                this.safeKill(()=> {
                  cb(e, user)
                })
              })

          }
        })

    })
  },
  login(identifier, password, cb){

  }

}

export default userApi
