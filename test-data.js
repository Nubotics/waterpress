let post = {
  create: {
    slug: '',
    title: 'post title',
    postType: 'post',
    excerpt: '',
    content: '<h1>Post title </h1><p>Yo Yo</p>',
    status: 'draft',
    postDate: new Date(),
    parent: 0,
    metaCollection: [
      {
        key: '_test',
        value: '1'
      }
    ],
    author: 1,
  },
  update: {
    id: 96,
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
  },
  category: {
    postId: 0,
    taxonomyId: 0,
    categoryId: 0,
  },
  meta: {
    post: 96,
    key: 'DERP_1',
    value: 'that',
  },
  metaCollection: {
    id: 96,
    metaCollection: [
      {
        key: 'DERP_1',
        value: 'something',
      },
      {
        key: 'DERP_2',
        value: 'something',
      },
      {
        key: 'DERP_3',
        value: 'something',
      },
    ],
  }
}

let comment = {
  create: {
    postId: 96,
    user: 1,
    content: '<b>Deeeerrrrp</b>',
  },
  update: {
    id: 1,
    content: '<b>Derp Deeeerrrrp</b>',
  },
  meta: {
    comment: 0,
    key: 'DERP',
    value: 'something',
  },
}

let media = {
  create: {},
  update: {},
  meta: {},
}

export default {
  post,
  comment,
  media,

}
