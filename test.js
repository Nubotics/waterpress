//lib

import wp, {
  EventApi,
  Api,
  Orm,
  u,

} from './src'
const {_} = u
import chalk from 'chalk'
import stringifyObject from 'stringify-object'
import {expressUtils} from './src/addons'
let {
  getInstanceOptions,
  setInstance,

  } = expressUtils

//plugins

//contained context

//(function () {

//tool functions

const noop = function (next) {
  console.log('done noop')
  next()
}
const end = function () {
  console.log('done end')
}
const inspectResult = function (err, result, withValues) {
  let report = 'result:\n'
  //don't like to hoist :/
  const deepInspectObject = (object, depth) => {
    depth = depth || ''
    let keyVal = null
    _.mapKeys(object, (currentValue, key)=> {
      keyVal = object[key]
      if (_.isArray(keyVal)) {
        _.forEach(keyVal, value=> {
          report += `${depth}${chalk.yellow(`${key} keys:`)}\n`
          deepInspectObject(value, depth += '--')
        })
      } else if (_.isPlainObject(keyVal) || _.isObject(keyVal)) {
        report += `${depth}${chalk.yellow(`${key} keys:`)}\n`
        deepInspectObject(keyVal, '--')
      } else {
        report += `${depth}-> ${chalk.yellow(key)} ${withValues ? `${object[key]}` : ''}\n`
      }

    })
  }
  const inspectObject = (object, depth)=> {
    depth = depth || ''
    report += `${depth}-> ${chalk.green('object returned')}\n`
    report += `${depth}--> ${chalk.yellow('keys:')}\n`
    deepInspectObject(object, depth)
    //TODO: further inspect contents of object
  }
  const inspectValue = (value)=> {
    report += `-> ${chalk.green('value returned')}\n`
    report += `--> ${chalk.cyan('value:')} ${value}\n`
  }
  const deepInspectArray = (array)=> {
    if (array.length > 0) {
      if (_.isPlainObject(array[0])) {
        report += `--> ${chalk.magenta('array first plain object:')}\n`
        inspectObject(array[0])
      } else if (_.isObject(array[0])) {
        report += `--> ${chalk.magenta('array first object:')}\n`
        inspectObject(array[0])
      } else {
        report += `--> ${chalk.magenta('array first value:')}\n`
        report += `--> ${array[0]}\n`
      }
    }
  }
  const inspectArray = (array)=> {
    report += `-> ${chalk.green('array returned')}\n`
    report += `--> ${chalk.magenta('array length:')} ${array.length}\n`
    deepInspectArray(array)

  }

  let stringOpts = {
    indent: '  ',
    singleQuotes: true
  }

  if (err) {
    report += `${chalk.red('err')}\n`
    report += `--> ${stringifyObject(err, stringOpts)}`
  } else if (_.isObject(result)) {
    if (_.isArray(result)) {
      inspectArray(result)
    } else if (_.isPlainObject(result)) {
      inspectObject(result)
    }
  } else {
    inspectValue(result)
  }

  return report

}

//test the whole api and plugins in one call

const options = {
  // base option for eventemitter and chain api
  //base:{},

  // instance option to plug into existing context
  //instance:{connections:{}, collections:{}}

  //db options for creating a fresh context
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

  //plugins
  plugins: [],

}

const api = wp(options)

// server
let port = 3005

let app = require('express')()
app.use('/waterpress', (req, res)=> {
  console.log('/waterpress -> options', options)
  let config = getInstanceOptions(req, options)
  console.log('/waterpress -> config', config)

  const wpApi = wp(config)

  let globalResult = {}

  wpApi
    .connect()
    /*  .post
     .one({slug:'hello-world'}, (err, result, next)=> {
     console.log('post -> one ->', inspectResult(err, result))
     globalResult = result
     next()
     })*/
    .category
    .findWithChildren({},(err,result,next)=>{
      console.log('category -> findWithChildren ->', inspectResult(err, result))
      globalResult = result
      next()
    })
    .find({},(err,result,next)=>{
      console.log('category -> findWithChildren ->', inspectResult(err, result))
      globalResult = result
      next()
    })
    .done()
    .disconnect((next)=> {
      console.log('disconnect')
      next()
      res.json(globalResult)
    })

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


/*api
 .setOption('isTest', true)
 .connect()

 //plug adhoc queries straight into the api

 .plug((context, next)=> {
 //context = api -> this
 console.log('plug -> context -> ', inspectResult(null, context))
 console.log('\n')
 next()
 })

 //:: Api that have db models

 //post api

 .set('postId', 0)
 .post
 .find({}, {limit: 5, skip: 5}, (err, result, next)=> {
 console.log('post -> find -> ', inspectResult(err, result, true))
 console.log('post -> find -> result', result)
 next()
 })
 .older(10, 3, (err, result, next)=> {
 console.log('post -> older -> ', inspectResult(err, result))
 next()
 })
 .newer(10, 3, (err, result, next)=> {
 console.log('post -> newer -> ', inspectResult(err, result))
 next()
 })
 .one({slug: 'video-post-eg'}, (err, result, next)=> {
 console.log('post -> one -> ', inspectResult(err, result, true))
 next()
 })
 .save({/!* stub post here *!/}, (err, result, next)=> {
 console.log('post -> save -> ', inspectResult(err, result))
 next()
 })
 .findChildren(100, (err, result, next)=> {
 console.log('post -> findChildren -> ', inspectResult(err, result))
 next()
 })
 .findByFormat('post-format-video', {}, (err, result, next)=> {
 console.log('post -> findByFormat -> ', inspectResult(err, result, true))
 console.log('post -> findByFormat -> result', result)
 next()
 })
 .findByCategory('owner-builder', {}, (err, result, next)=> {
 console.log('post -> findByCategory -> ', inspectResult(err, result, true))
 console.log('post -> findByCategory -> result', result)
 next()
 })
 .done(next=> {
 console.log('post -> done\n')
 next()
 })

 //user api


 .set('userId', 0)
 .user
 .find({id: {'>': 10}}, (err, result, next)=> {
 console.log('user -> find ->', inspectResult(err, result))
 next()
 })
 .one({id: 1}, (err, result, next)=> {
 console.log('user -> one ->', inspectResult(err, result))
 next()
 })
 .byRole('administrator', (err, result, next)=> {
 console.log('user -> byRole ->', inspectResult(err, result))
 next()
 })
 .existsByEmail('email', (err, result, next)=> {
 console.log('user -> existsByEmail ->', inspectResult(err, result))
 next()
 })
 .save({/!* stub user here *!/}, (err, result, next)=> {
 console.log('user -> save ->', inspectResult(err, result))
 next()
 })
 .checkLogin('email', 'password', (err, result, next)=> {
 console.log('user -> checkLogin ->', inspectResult(err, result))
 next()
 })
 .done(next=> {
 console.log('user -> done\n')
 next()
 })


 //term api

 .set('termId', 0)
 .term
 .find({name: {'contains': 'video'}}, (err, result, next)=> {
 console.log('term -> find ->', inspectResult(err, result, true))
 //console.log('term -> find -> result ->', result)
 next()
 })
 .byTaxonomy({taxonomy: 'category'}, (err, result, next)=> {
 console.log('term -> byTaxonomy ->', inspectResult(err, result, true))
 //console.log('term -> byTaxonomy -> result ->', result)
 next()
 })
 .done(next=> {
 console.log('term -> done\n')
 next()
 })

 //comment api

 /!*   .set('commentId', 0)
 .comment
 .find({term: {'>': 1}}, (err, result, next)=> {
 console.log('comment -> find ->', inspectResult(err, result))
 next()
 })
 .one({id: 1}, (err, result, next)=> {
 console.log('comment -> one ->', inspectResult(err, result))
 next()
 })
 .save({/!* comment stub *!/}, (err, result, next)=> {
 console.log('comment -> save ->', inspectResult(err, result))
 next()
 })
 .kill(1, (err, result, next)=> {
 console.log('comment -> kill ->', inspectResult(err, result))
 next()
 })
 .done(next=> {
 console.log('comment -> done\n')
 next()
 })*!/

 //:: Api that have assembled models

 //category api

 .set('categoryId', 0)
 .category
 .find({}, (err, result, next)=> {
 console.log('category -> find ->', inspectResult(err, result, true))
 console.log('category -> find -> result =>', result)
 next()
 })
 .findChildren({}, (err, result, next)=> {
 console.log('category -> findChildren ->', inspectResult(err, result, true))
 console.log('category -> findChildren -> result =>', result)
 next()
 })
 .findWithChildren({}, (err, result, next)=> {
 console.log('category -> findWithChildren ->', inspectResult(err, result, true))
 console.log('category -> findWithChildren -> result =>', result)
 next()
 })
 .one({name: 'engineer'}, (err, result, next)=> {
 console.log('category -> one ->', inspectResult(err, result, true))
 console.log('category -> one -> result ->', result)
 next()
 })
 .done(next=> {
 console.log('category -> done\n')
 next()
 })


 //format api

 /!*  .set('postFormat', 'post')
 .format
 .find({}, (err, result, next)=> {
 console.log('format -> find ->', inspectResult(err, result))
 next()
 })
 .done(next=> {
 console.log('format -> done\n')
 next()
 })
 *!/
 //media api

 .set('mediaId', 0)
 .media
 .find({}, (err, result, next)=> {
 console.log('media -> find ->', inspectResult(err, result))
 next()
 })
 .one({title: 'sad owl'}, (err, result, next)=> {
 console.log('media -> one ->', inspectResult(err, result))
 next()
 })
 .save({/!* media stub *!/}, (err, result, next)=> {
 console.log('media -> save ->', inspectResult(err, result))
 next()
 })
 .kill(1, (err, result, next)=> {
 console.log('media -> kill ->', inspectResult(err, result))
 next()
 })
 .done(next=> {
 console.log('media -> done\n')
 next()
 })

 //page api

 .set('pageId', 0)
 .page
 .find({}, (err, result, next)=> {
 console.log('page -> find ->', inspectResult(err, result))
 next()
 })
 .one({slug: 'sample-page'}, (err, result, next)=> {
 console.log('page -> one ->', inspectResult(err, result))
 next()
 })
 .save({/!* page stub *!/}, (err, result, next)=> {
 console.log('page -> save ->', inspectResult(err, result))
 next()
 })
 .kill(1, (err, result, next)=> {
 console.log('page -> kill ->', inspectResult(err, result))
 next()
 })
 .done(next=> {
 console.log('page -> done\n')
 next()
 })

 //tag api

 /!* .set('tagId', 0)
 .tag
 .find({}, (err, result, next)=> {
 console.log('tag -> find ->', inspectResult(err, result))
 next()
 })
 .one({id: 1}, (err, result, next)=> {
 console.log('tag -> one ->', inspectResult(err, result))
 next()
 })
 .done(next=> {
 console.log('tag -> done\n')
 next()
 })*!/

 // finish up

 .disconnect((next)=> {
 console.log('disconnect')
 next()
 })*/

console.log('test executed\n')

//})()
