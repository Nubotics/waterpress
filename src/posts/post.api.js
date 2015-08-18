import {_} from '../core/util'

let postApi = {
  all(params, limit, sort, chainStart, chainEnd, cb) {

    const action = (collections)=> {

      let query = collections.post
        .find()
        .where(params)

      console.log('POST ALL | params', params)

      if (limit)
        query
          .limit(limit)

      if (sort)
        query
          .sort(sort)

      query
        .populate('author')
        .populate('relationshipCollection')
        .populate('metaCollection')
        .exec((e, posts)=> {

          if (chainEnd) {
            this.safeKill(()=> {
              cb(e, posts)
            })

          } else {
            cb(e, posts)

          }

        })
    }

    if (chainStart) {
      this.safeConnect((error)=> {
        if (error) throw(error)
        action(this.collections)
      })

    } else {
      action(this.collections)
    }

  },
  one(params, chainStart, chainEnd, cb)
  {

    const action = (collections)=> {

      collections.post
        .findOne()
        .where(params)
        .populate('author')
        .populate('relationshipCollection')
        .populate('metaCollection')
        .exec((e, post)=> {

          if (chainEnd) {
            this.safeKill(()=> {
              cb(e, post)
            })

          } else {
            cb(e, post)

          }

        })
    }

    if (chainStart) {
      this.safeConnect((error)=> {
        if (error) throw(error)
        action(this.collections)

      })
    } else {
      action(this.collections)
    }


  },
  next()
  {
  },
  previous()
  {
  },
  byTerm()
  {
  },
  byAuthor()
  {
  }
}


export default postApi
