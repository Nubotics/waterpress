let post = {
  create: {
    slug: '',
    title: '',
    postType: '',
    excerpt: '',
    content: '',
    status: '',
    postDate: new Date(),
    mimeType: '',
    guid: '',
    parent: 0,
    metalCollection: [
      {
        key: '',
        value: ''
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
