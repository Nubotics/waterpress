import wp from './src'
import {expressUtils} from './src/addons'
const { getInstanceOptions, setInstance } = expressUtils

const options = {
  //db options for creating a fresh context
  db: {
    connections: {
      mysql: {
        adapter: 'mysql',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'buildaidcms'
      }
    }
  },

  //plugins
  plugins: [],

}

const api = wp(options)

//::-> DATA
let data = require('./test-data')

let { post, comment, media } = data

let error = []
let result = {}

api
  .connect()
  .media
  .save(media.create, (err, newMedia, next)=> {
    if (err) error.push(err)
    result.newMedia = newMedia
    next()
  })
  //.find({},(err,comments,next)=>{
  //  if (err) error.push(err)
  //  result.commentCollection = comments
  //  next()
  //})
  /*  .category
   .find({}, (err, collection, next)=> {
   if (err) error.push(err)
   result.terms = collection
   next()
   })*/
  /*  .post
   .save(post.update, (err, newPost, next)=> {
   if (err) error.push(err)
   result.savedPost = newPost
   next()
   })*/
  /*  .find({title: 'post title', status:'all'}, {}, (err, postCollection, next)=> {
   if (err) error.push(err)
   result.postCollection = postCollection
   next()
   })*/
  .done()
  .disconnect((next)=> {
    next()

    console.log('disconnect -> error, result', error, result)

  })

//::-> test service

/*
 let app = require('express')()
 app.use('/waterpress', (req, res)=> {

 })

 api
 .connect((err, instance, next)=> {
 next()
 let {connections, collections} = instance
 app = setInstance(app, connections, collections)
 app.listen(port, '0.0.0.0', ()=> {
 console.log(`waterpress2 server standalone started on port ${port}`)
 })
 })

 */
