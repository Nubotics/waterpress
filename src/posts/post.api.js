import {_} from '../core/util'

let postApi = {
  all(take, skip, cb) {
    this.safeConnect((error, collections)=> {
      if (error) throw(error)

      collections.term
        .find()
        .populate('taxonomyCollection')
        .exec((err, terms)=> {

          collections.post
            .find()
            .populate('author')
            .populate('relationshipCollection')
            .populate('metaCollection')
            .exec((e, posts)=> {

              if (!posts) {
                this.safeKill(()=> {
                  cb(e, post, terms)
                })

              } else {
                posts = posts.map(post=> {
                  if (_.has(post, 'relationshipCollection')) {
                    post.categoryCollection = []
                    post.tagCollection = []

                    let cat = null
                    post.relationshipCollection.map((rel)=> {
                      cat = _.find(terms, (term)=> {
                        return term.taxonomyCollection[0].id == rel.termTaxonomyId
                      })
                      if (cat) {
                        cat.taxonomy = cat.taxonomyCollection[0].taxonomy
                        if (cat.taxonomy.toLowerCase() === 'category') {
                          post.categoryCollection.push(cat)
                        } else {
                          post.categoryCollection.push(cat)
                        }

                      }
                    })
                  }
                  return post
                })


                this.safeKill(()=> {
                  cb(e, posts, terms)
                })

              }
//end exec
            })
//end exec
        })
//end connect
    })

  },
  one(params, cb) {
    this.safeConnect((error, collections)=> {
      if (error) throw(error)

      collections.term
        .find()
        .populate('taxonomyCollection')
        .exec((err, terms)=> {

          collections.post
            .findOne()
            .where(params)
            .populate('authorId')
            .populate('relationshipCollection')
            .populate('metaCollection')
            .exec((e, post)=> {

              if (!post) {
                this.safeKill(()=> {
                  cb(e, post, terms)
                })

              } else {

                if (_.has(post, 'relationshipCollection')) {
                  post.categoryCollection = []
                  post.tagCollection = []

                  let cat = null
                  post.relationshipCollection.map((rel)=> {
                    cat = _.find(terms, (term)=> {
                      return term.taxonomyCollection[0].id == rel.termTaxonomyId
                    })
                    if (cat) {
                      cat.taxonomy = cat.taxonomyCollection[0].taxonomy
                      if (cat.taxonomy.toLowerCase() === 'category') {
                        post.categoryCollection.push(cat)
                      } else {
                        post.categoryCollection.push(cat)
                      }

                    }
                  })
                }

                this.safeKill(()=> {
                  cb(e, post, terms)
                })

              }
//end exec
            })
//end exec
        })
//end connect
    })
  },
  next() {
  },
  previous() {
  },
  byTerm() {
  },
  byAuthor() {
  }
}


export default postApi
