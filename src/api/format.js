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

import assemblers from '../assemblers'

export default {
  find(params, cb, next){
    params = assign(params, {taxonomy: 'post_format'})
    this.term.byTaxonomy(params, (err, termTaxonomyCollection, cbNext)=> {
      if (err) {
        cb(err, null, cbNext)
      }
      else {
        if (termTaxonomyCollection) {
          cb(err, assemblers.category.collection(termTaxonomyCollection, null, true), cbNext)
        } else {
          cb(err, termTaxonomyCollection, cbNext)
        }
      }
    }, next)
  },
}
