import Api from './src/core/Api'

(function () {



  const config = {
    connections: {
      mysql: {
        adapter:'mysql',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'cms'
      }
    }

  }

  const wpApi = new Api(config, (err, schema)=> {
    if (err) console.log('err', err)

    console.log('schema',schema)



  })


})()
