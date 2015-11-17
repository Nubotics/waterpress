//lib
import wp, {
  EventApi,
  Api,
  Orm,
  u,

} from './src'

//plugins
import pluginNioPressCommunity from './src/plugins/nio-press-community'
import pluginWpCategoryMeta from './src/plugins/wp-category-meta'

(function () {

  const options = {
    db: {
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
    },
    plugins: []

  }

  let api = wp(options)

  let noop = function (next) {
    console.log('done noop')
    next()
  }

  let end = function () {
    console.log('done end')
  }

  api
    .connect()

    //post api
    .post
    .find({},{limit:1,skip:3}, (err, postCollection, next)=> {
      if (postCollection) {
        console.log('post -> find -> postCollection',postCollection)
      }
      next()
    })
    .done()
    //user api
    /*
     .set('userId', 0)
     .user
     .find({}, (err, userCollection, next)=> {
     let len = 0
     if (userCollection) len = userCollection.length
     console.log('api -> user -> find -> cb -> err, userCollection.length', err, len)

     next()
     })
     .one({id: 1}, (err, user, next)=> {
     console.log('api -> user -> one -> cb -> err, user', err, user)

     next()
     })
     .byRole('', (err, userCollection, next)=> {
     let len = 0
     if (userCollection) len = userCollection.length
     console.log('api -> user -> byRole -> cb -> err, userCollection.length', err, len)

     next()
     })
     .done()
     .plug((context, next)=> {
     console.log('plug')
     next()
     })
     */

    //term api
    /*
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
     */

    // finish up
    .disconnect((next)=> {
      console.log('disconnect')
      next()
    })

  console.log('test done')

})()
