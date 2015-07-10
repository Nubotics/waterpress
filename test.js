import Api from './src/core/Api'

(function () {


  const config = {
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

  const wpApi = new Api(config, (err, collections)=> {
    if (err) console.log('err', err)

    //console.log('collections',collections)

    /*
     wpApi._collections.user
     .findOne()
     .where({id: 2})
     .populate('metaCollection')
     .then(user => {
     console.log('found user', user)
     }, error => {
     console.log('user error', error)
     })

     wpApi._collections.user.findMeta(
     2,
     ['first_name', 'last_name'],
     (value)=> {
     console.log('user meta value:', value)
     })

     wpApi._collections.user.getMetaAsObject(
     2,
     (value)=> {
     console.log('user meta obj:', value)
     })
     */

    wpApi._collections.post
      .findOne()
      .where({id: 4})
      .populate('metaCollection')
      .populate('relationshipCollection')
      .then(posts => {
        console.log('posts', posts)
        console.log('-------------------------')
      }, error => {
        console.log('posts error', error)
        console.log('-------------------------')
      })


    wpApi._collections.term
      .find()
      .populate('taxonomyCollection')
      .then(terms => {
        console.log('terms', terms)
        console.log('-------------------------')
      }, error => {
        console.log('terms error', error)
        console.log('-------------------------')
      })


    wpApi._collections.termtaxonomy
      .find()
      .populate('relationshipCollection')
      .then(tax => {
        console.log('tax', tax)
        console.log('-------------------------')
      }, error => {
        console.log('tax error', error)
        console.log('-------------------------')
      })

    wpApi._collections.termrelationship
      .find()
      .then(rels => {
        console.log('rels', rels)
        console.log('-------------------------')
      }, error => {
        console.log('rels error', error)
        console.log('-------------------------')
      })
    //console.log('collections:',wpApi._collections)

    //console.log('-------------------------')

  })


})()
