let termApi = {
  all(cb){
    this.safeConnect((error, collections)=> {
      if (error) throw(error)

      collections.term
        .find()
        .populate('taxonomyCollection')
        .exec((err, terms)=> {
          this.safeKill(()=> {
            cb(err, terms)
          })
        })

    })
  },
  byPost(){
  },
  byTaxonomy(){
  }
}

export default termApi
