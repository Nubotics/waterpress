import WpApi from './src/core/WaterpressApi'

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


  let wpApi = new WpApi(config)

  /* wpApi.term.byTaxonomy(null,false,(err,data)=>{
   if (err) throw(err)
   if (data){
   console.log('wp api term.byTaxonomy found ', data)
   }else{
   console.log('wp api term.byTaxonomy NOT found', data)
   }
   })*/


  wpApi.post.all(null, null, null, true, false, (err, posts) => {
    if (err) throw(err)
    if (posts) {
      console.log('wp api posts found ', posts)
    } else {
      console.log('wp api posts NOT found', posts)
    }

    wpApi.post.one({id: 153}, false, true, (err, post) => {
      if (err) throw(err)
      if (post) {
        console.log('wp api post found ', terms, post)
      } else {
        console.log('wp api post NOT found', terms, post)
      }

    })


  })




  /*  wpApi.term.all({},false,(err, terms) => {
   if (err) throw(err)
   if (terms) {
   console.log('wp api posts found ', terms)
   } else {
   console.log('wp api posts NOT found', terms)
   }

   })*/

  /*  wpApi.user.one({id: 21}, true, false, (err, user) => {
   if (err) console.log(err)

   if (user) {
   console.log('wp api one user found ', user)
   } else {
   console.log('wp api one user NOT found', user)
   }

   wpApi.user.byRole('author', false, false, (e, users) => {
   if (e) console.log(e)

   if (users) {
   console.log('wp api user by role found ', users)
   } else {
   console.log('wp api user by role NOT found', users)
   }

   wpApi.user.existsByEmail('jozi011@gmail.com',false, true, (error,exists)=>{
   if (error) console.log(error)

   console.log('wp api user by email found ', exists)
   })


   })

   })*/

  /* wpApi.term.all(null, true, false, (error, termCollection)=> {
   if (error) console.log(error)

   if (termCollection) {
   console.log('wp api term all found ', termCollection)
   } else {
   console.log('wp api term all NOT found', termCollection)
   }

   wpApi.term.all(null, false, true, (error, termTaxCollection)=> {
   if (error) console.log(error)

   if (termTaxCollection) {
   console.log('wp api term tax found ', termTaxCollection)
   } else {
   console.log('wp api term tax NOT found', termTaxCollection)
   }
   })


   })*/


  /*  const wpApi = new WpApi(config, (err, collections)=> {
   if (err) console.log('err', err)

   //console.log('collections',collections)

   /!*
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
   *!/

   wpApi._collections.post
   .findOne()
   .where({id: 140})
   /!* .populate('metaCollection')
   .populate('relationshipCollection')
   .populate('commentCollection')*!/
   //.populateAll()
   .then(posts => {
   console.log('posts', posts)
   console.log('-------------------------')
   }, error => {
   console.log('posts error', error)
   console.log('-------------------------')
   })


   wpApi._collections.term
   .find()
   //.populate('taxonomy')
   //.populateAll()
   .then(terms => {
   console.log('terms', terms)
   console.log('-------------------------')
   }, error => {
   console.log('terms error', error)
   console.log('-------------------------')
   })


   wpApi._collections.termtaxonomy
   .find()
   //.populate('relationshipCollection')
   //.populateAll()
   .then(tax => {
   console.log('tax', tax)
   console.log('-------------------------')
   }, error => {
   console.log('tax error', error)
   console.log('-------------------------')
   })

   wpApi._collections.termrelationship
   .find()
   //.populateAll()
   .then(rels => {
   console.log('rels', rels)
   console.log('-------------------------')
   }, error => {
   console.log('rels error', error)
   console.log('-------------------------')
   })

   wpApi._collections.comment
   .find()
   //.populate('metaCollection')
   .populateAll()
   .then(comms => {
   console.log('comments', comms)
   console.log('-------------------------')
   }, error => {
   console.log('comments error', error)
   console.log('-------------------------')
   })


   //console.log('collections:',wpApi._collections)

   //console.log('-------------------------')

   })*/


})()
