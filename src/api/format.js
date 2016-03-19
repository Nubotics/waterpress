//util
import {

  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObject,
  merge,

} from '../core/util'

import assemblers from '../assemblers'
import termApi from './term'

export default {
  find(params, cb, next){
    params = assign(params, {taxonomy: 'post_format'})
    termApi.byTaxonomy.call(this, params, function(err, termTaxonomyCollection) {
      if (err) {
        cb(err, null, next)
      }
      else {
        if (termTaxonomyCollection) {
          cb(err, assemblers.category.collection(termTaxonomyCollection, null, true), next)
        } else {
          cb(err, termTaxonomyCollection, next)
        }
      }
    })
  },
}
