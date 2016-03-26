let post = {
  create: {
    slug: '',
    title: 'post title',
    postType: 'post',
    excerpt: '',
    content: '<h1>Post title </h1><p>Yo Yo</p>',
    status: 'draft',
    postDate: new Date(),
    //mimeType: '',
    //guid: '',
    parent: 0,
    metaCollection: [
      {
        key: '_test',
        value: '1'
      }
    ],
    author: 1,
   /* relationshipCollection: [
      {
        termTaxonomy: 3,
        order: 0
      }
    ],*/
    /*
     childCollection:[],
     commentCollection:[],
     */
  },
  update: {
    id:96,
    title: 'post title',
    content: '<h1>Post title </h1><p>Yes yess</p>',
    status: 'publish',
    //postDate: new Date(),
    //mimeType: '',
    //guid: '',
    //parent: 0,
    metaCollection: [
      {
        key: '_test',
        value: '2'
      }
    ],
    author: 1,
    /*relationshipCollection: [
      {
        termTaxonomy: 3,
        order: 0
      }
    ],*/
  }
}

let comment = {
  create: {
    postId:96,
    user:1,
    content:'<b>Deeeerrrrp</b>',

  },
  update: {},
}

let attachment = {
  create: {

  },
  update: {},
}

export default {
  post,
  comment,
  attachment,

}
