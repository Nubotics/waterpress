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

let { post, comment } = data

let error = null
let result = null

api
  .connect()
  .post
  .save(post.create, (err, newPost, next)=> {
    error = err
    result = newPost
    next()
  })
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
