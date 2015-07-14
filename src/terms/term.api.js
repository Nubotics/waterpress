let termApi = {
  all(cb){
    this.safeConnect((error)=> {
      if (error) throw(error)

      this.collections.term
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
  byTaxonomy(params, cb){
    this.safeConnect((error)=> {
      if (error) throw(error)

      //console.log('bytaxonomy',  this.collections.user)

      this.collections.termtaxonomy
        .find()
        .where(params)
        .populate('term')
        .populate('childCollection')
        .populate('relationshipCollection')
        .exec((err, data)=> {

          cb(err, data)

          this.safeKill()
        })
    })
  }
}

export default termApi
