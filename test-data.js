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
    relationshipCollection: [
      {
        termTaxonomy: 3,
        order: 0
      }
    ],
    /*
     childCollection:[],
     commentCollection:[],
     */
  },
  update: {}
}

let comment = {
  create: {},
  update: {},
}

let attachment = {
  create: {},
  update: {},
}

export default {
  post,
  comment,
  attachment,

}
