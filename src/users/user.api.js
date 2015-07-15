import {_} from '../core/util'
let userApi = {
  one(params, chainStart, chainEnd, cb){
    //console.log('one checking state', this.collections)
    const action = (collections)=> {
      //console.log('find one user, chainend', chainEnd, collections)
      collections.user
        .findOneWithMeta(params, (err, user)=> {
          if (chainEnd) {
            console.log('ABOUT TO SAFE KILL')
            this.safeKill(()=> {
              cb(err, user)
            })

          } else {
            cb(err, user)
          }
        })
    }
    console.log('find one user, chainstart', chainStart)
    if (chainStart) {
      this.safeConnect((error)=> {
        if (error) throw(error)
        action(this.collections)
      })
    } else {
      action(this.collections)
    }

  },
  find(params, chainStart, chainEnd, cb){

    const action = (collections)=> {
      collections.user
        .findWithMeta(params, (e, userArr)=> {
          if (chainEnd) {
            console.log('find ABOUT TO SAFE KILL')
            this.safeKill(()=> {
              cb(e, userArr)
            })

          } else {
            cb(e, userArr)
          }

        })
    }

    if (chainStart) {
      this.safeConnect((error)=> {
        if (error) throw(error)
        action(this.collections)
      })
    } else {
      action(this.collections)
    }


  },
  byRole(roleName, chainStart, chainEnd, cb){

    const subAction = (params)=> {
      this.user.find(params, false, chainEnd, cb)
    }

    const action = (collections)=> {
      collections.usermeta
        .find()
        .where({key: 'wp_capabilities', value: {'contains': roleName}})
        .exec((err, meta)=> {
          let userIdArr = []
          if (meta) {

            meta.map((item)=> {
              //console.log('item', item.userId)
              userIdArr.push(item.user)
            })

            subAction({id: userIdArr})

          } else {

            if (chainEnd) {
              console.log('byRole 2 ABOUT TO SAFE KILL')
              this.safeKill(()=> {
                cb(err, null)
              })
            } else {
              cb(err, null)
            }

          }
        })
    }

    if (chainStart) {
      this.safeConnect((error)=> {
        if (error) throw(error)
        action(this.collections)
      })
    } else {
      action(this.collections)
    }

  },
  existsByEmail(email, chainStart, chainEnd, cb){

    const action = ()=> {
      this.user.one({email}, false, false, (err, user)=> {

        if (chainEnd) {

          this.safeKill(()=> {
            if (user) {
              cb(err, true)
            } else {
              cb(err, false)
            }
          })


        } else {

          if (user) {
            cb(err, true)
          } else {
            cb(err, false)
          }

        }

      })
    }

    if (chainStart) {
      this.safeConnect((error)=> {
        if (error) throw(error)
        action()
      })
    } else {
      action()
    }

  },
  save(userObj, chainStart, chainEnd, cb){

    const updateAction = (collections)=> {
      collections.user
        .update({id: userObj.id}, userObj)
        .exec((e, users)=> {
          //TODO: validate the response before callback
          if (chainEnd) {

            this.safeKill(()=> {
              cb(e, users[0])
            })

          } else {
            cb(e, users[0])
          }


        })
    }

    const createAction = (collections)=> {
      collections.user
        .create(userObj)
        .exec((e, user)=> {
          //TODO: validate the response before callback
          if (chainEnd) {

            this.safeKill(()=> {
              cb(e, user)
            })

          } else {
            cb(e, user)
          }

        })

    }

    const action = (collections)=> {
      collections.user
        .one({email: userObj.email}, (err, user)=> {
          if (user) {

            updateAction(collections)

          } else {

            createAction(collections)

          }
        })
    }

    //TODO: santiize userObj
    if (chainStart) {

      this.safeConnect((error)=> {
        if (error) throw(error)

        action(this.connections)

      })

    } else {

      action(this.connections)

    }


  },
  login(identifier, password, chainConnection, cb){

  }

}

export default userApi
