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
  if (this.collections) {
    let isFlatValue = false
    let query = {taxonomy: 'category'}

    if (isFlat) {
      isFlatValue = isFlat
    }

    this.collections
      .termtaxonomy
      .find()
      .where(query)
      .populate('term', params)
      .populate('childCollection')
      .populate('relationshipCollection')
      .exec((err, collection)=> {
        if (err) {
          cb(err, collection, next)
        } else {
          let categoryCollection = assemble.category.collection(collection, null, isFlatValue)
          cb(err, categoryCollection, next)
        }
      })

  } else {
    cb('Not connected', null, next)
  }
}

let one = function (params, cb, next) {
  if (this.collections) {
    let query = {taxonomy: 'category'}
    //query = assign(params, query)
    //termApi.byTaxonomy.call(this, query, function (err, collection) {
    this.collections
      .term
      .find()
      .where(query)
      .populate('term', params)
      .populate('childCollection')
      .populate('relationshipCollection')
      .exec((err, collection)=> {
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
      })
    //}, next)
  } else {
    cb('Not connected', null, next)
  }
}

//main
export default {find, one}
