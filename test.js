import {
  EventApi,
  Api,
  Orm,
  u,

} from './src'


(function () {

  const options = {
    connections: {
      mysql: {
        adapter: 'mysql',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'cms'
      }
    }

  }

  let api = new Api(options)

  let noop = function (next) {
    console.log('done noop')
    next()
  }

  let end = function () {
    console.log('done end')
  }

  api
    .connect()

    //user api
    .set('userId', 0)
    .user
    .find({}, (err, {userCollection}, next)=> {
      console.log('api -> user -> find -> cb -> err, userCollection', err, userCollection)

      next()
    })
    .done()

    //term api
     .set('userId', 1)
     .term
     .findOne({}, function (err, {termCollection}, next) {
     console.log('api -> term -> findOne -> cb -> err, termCollection', err, termCollection)

     next()
     })
     .done()

     //post api
     .post
     .find({}, function (err, {postCollection}, next) {
     console.log('api -> post -> find -> cb -> err, postCollection', err, postCollection)

     next()
     })
     .done()

     //comment api
     .comment
     .find({}, function (err, {commentCollection}, next) {
     console.log('api -> comment -> find -> cb -> err, commentCollection', err, commentCollection, this)

     next()
     })
     .done(noop)

    // finish up
    .disconnect((next)=> {
      console.log('disconnect')
      next()
    })

  console.log('test done')

})()
