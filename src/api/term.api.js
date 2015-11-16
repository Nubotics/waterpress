let termApi = {
  all(params, chainStart, chainEnd, cb){

    const action = (collections)=> {
      collections.term
        .find()
        .where(params)
        .populate('taxonomyCollection')
        .exec((err, terms)=> {
          if (chainEnd) {
            this.safeKill(()=> {
              cb(err, terms)
            })
          } else {
            cb(err, terms)
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
  byPost(){

  },
  byTaxonomy(params, chainStart, chainEnd, cb){

    const action = (collections)=> {
      collections.termtaxonomy
        .find()
        .where(params)
        .populate('term')
        .populate('childCollection')
        .populate('relationshipCollection')
        .exec((err, data)=> {
          if (chainEnd) {

            this.safeKill(()=> {
              cb(err, data)
            })

          } else {

            cb(err, data)

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

  }
}

export default termApi
