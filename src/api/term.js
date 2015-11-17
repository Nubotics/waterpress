//util
import {
  _,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObjectFromKeyCollection,
  merge,

} from '../core/util'

//main
export default {
  find(params, cb, next){
    //console.log('user -> find',arguments, params)
    //console.log('user -> find', params, cb, next)
    if (this.collections) {
      this.collections
        .term
        .find()
        .where(params)
        .populate('taxonomyCollection')
        .exec((err, termsCollection)=> {
          cb(err, termsCollection, next)
        })

    } else {
      cb('Not connected', null, next)
    }
  },
  byTaxonomy(params, cb, next){
    if (this.collections) {
      this.collections
        .termtaxonomy
        .find()
        .where(params)
        .populate('term')
        .populate('childCollection')
        .populate('relationshipCollection')
        .exec((err, collection)=> {
          cb(err, collection, next)
        })

    } else {
      cb('Not connected', null, next)
    }
  }
}

