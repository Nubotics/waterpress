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
    metaCollection: [
      {
        key: '_test',
        value: 'derp erp'
      }
    ],
    author: 1,
  },
  category: {
    id: 96,
    //taxonomyId: 0,
    categoryId: 4,
  },
  meta: {
    single: {
      //id:0,
      post: 96,
      key: '_test_1',
      value: 'derp erp 123 456'
    },
    collection: {
      id: 96,
      metaCollection: [
        {
          //post: ,
          post: 96,
          key: '_test_2',
          value: 'derp erp 123 456'
        },
        {
          id: 292,
          //post: 0,
          post: 96,
          key: '_test_3',
          value: 'derp erp 123 456'
        },
      ]
    },
  },
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
  create: {
    status: 'inherit',
    postDate: new Date(),
    mimeType: '',
    guid: 'media/2',
    parent: 0,
    metaCollection: [
      {
        key: '_test',
        value: 'derp erp'
      }
    ],
    author: 1,
  },
  update: {
    id: 96,
    status: 'inherit',
    slug: '96',
    guid: 'media/2/3',
    metaCollection: [
      {
        key: '_test',
        value: 'derp erp 123'
      }
    ],
    author: 1,
  },
  meta: {
    single: {
      //id:0,
      post: 0,
      key: '_test_1',
      value: 'derp erp 123'
    },
    collection: {
      id: 0,
      metaCollection: [
        {
          post: 0,
          key: '_test_2',
          value: 'derp erp 123'
        },
        {
          //id:0,
          post: 0,
          key: '_test_3',
          value: 'derp erp 123'
        },
      ]
    },
  },
}

export default {
  post,
  comment,
  media,

}
