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

import termApi from './term'
import assemble from '../assemblers'

let find = function (params, isFlat, cb, next) {

  let isFlatValue = false
  let query = {taxonomy: 'category'}

  if (isFlat) {
    isFlatValue = isFlat
  }

  query = assign(params, query)

  termApi.byTaxonomy.call(this, query, function (err, collection) {
    if (err) {
      cb(err, collection, next)
    } else {
      let categoryCollection = assemble.category.collection(collection, null, isFlatValue)
      cb(err, categoryCollection, next)
    }
  })

}

let one = function (params, cb, next) {
  let query = {taxonomy: 'category'}
  query = assign(params, query)
  termApi.byTaxonomy.call(this, query, function (err, collection) {

    if (err) {
      cb(err, null, next)
    } else {
      if (collection && _.isArray(collection)) {
        if (collection.length > 0) {
          let entity = collection[0]
          let category = assemble.category.entity(entity, null, false)
          cb(err, category, next)
        } else {
          cb(err, null, next)
        }
      } else {
        cb(err, null, next)
      }

    }
  }, next)
}

//main
export default {find, one}
