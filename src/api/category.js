//util
import {
  map,
  is,
  filter,
  pluck,
  isArray,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObject,
  merge,

} from '../core/util'

import termApi from './term'
import assembler from '../assemblers'

let pushChildToTermInCollection = function (taxCollection, childCollection) {
  let foundChildCollection = []
  return map(taxCollection, tax=> {
    tax.childCollection = []
    foundChildCollection = filter(childCollection, {parent: tax.term.id})
    if (isArray(foundChildCollection)) {
      tax.childCollection = foundChildCollection
    }
    return tax
  })
}

let find = function (params, cb, next) {
  if (this.collections) {
    let query = {taxonomy: 'category'}
    let termIdCollection = []

    this.collections
      .termtaxonomy
      .find()
      .where(query)
      .populate('term')
      //.populate('childCollection')
      .exec((err, collection)=> {
        if (err) {
          cb(err, collection, next)
        } else {
          if (isArray(collection)) {
            termIdCollection = collection.map(termTax=> {
              return termTax.term.id
            })
            if (termIdCollection.length > 0) {
              params = assign({id: termIdCollection}, params)
              this.collections
                .term
                .find()
                .where(params)
                .exec((error, termCollection)=> {
                  cb(error, assembler.category.detailCollection(collection, termCollection), next)
                })

            } else {
              cb(err, collection, next)
            }

          } else {
            cb(err, collection, next)
          }
        }
      })

  } else {
    cb('Not connected', null, next)
  }
}

let findChildren = function (params, cb, next) {
  if (this.collections) {
    let parent = 0
    if (has(params, 'parent')) parent = params.parent

    let parentQuery = parent
    if (parent == 0) parentQuery = {'!': 0}

    let query = {taxonomy: 'category', parent: parentQuery}
    let termIdCollection = []

    this.collections
      .termtaxonomy
      .find()
      .where(query)
      .populate('term')
      //.populate('childCollection')
      .exec((err, collection)=> {
        if (err) {
          cb(err, collection, next)
        } else {
          if (isArray(collection)) {
            termIdCollection = collection.map(termTax=> {
              return termTax.term.id
            })
            if (termIdCollection.length > 0) {
              this.collections
                .term
                .find()
                .where({id: termIdCollection})
                .exec((error, termCollection)=> {
                  //cb(error, termCollection, next)
                  cb(error, assembler.category.detailCollection(collection, termCollection), next)
                })

            } else {
              cb(err, collection, next)
            }

          } else {
            cb(err, collection, next)
          }
        }
      })

  } else {
    cb('Not connected', null, next)
  }
}
let findWithChildren = function (params, cb, next) {
  if (this.collections) {
    //:-> defaults
    let query = {taxonomy: 'category', parent: 0}
    let termCollection = []
    let termIdCollection = []
    //:-> helpers
    //-> find -> top level termTaxonomy
    //-> by -> tax = category
    this.collections
      .termtaxonomy
      .find()
      .where(query)
      //.populate('childCollection')
      .populate('term')
      //.populate('parent')
      .exec((err, collection)=> {
        if (err || !isArray(collection)) {
          cb(err, collection, next)
        } else {
          termCollection = pluck(collection, 'term')
          termIdCollection = pluck(termCollection, 'id')
          findChildren
            .call(this,
            {parent: termIdCollection},
            function (err, childCategoryCollection) {
              let result = pushChildToTermInCollection(collection, childCategoryCollection)
              let categoryCollection = assembler.category.collectionWithChildren(result)
              cb(err, categoryCollection, next)

            })
        }
      })
  } else {
    cb('Not connected', null, next)
  }
}

let one = function (params, cb, next) {
  if (this.collections) {
    find.call(this, params, function (err, categoryCollection) {
      if (err) {
        cb(err, null, next)
      } else {
        if (categoryCollection) {
          if (isArray(categoryCollection)) {
            if (categoryCollection.length > 0) {
              cb(err, categoryCollection[0], next)
            } else {
              cb(err, null, next)
            }
          } else {
            cb(err, categoryCollection, next)
          }
        } else {
          cb(err, null, next)
        }
      }
    })
  } else {
    cb('Not connected', null, next)
  }
}

//main
export default {find, findChildren, findWithChildren, one}
