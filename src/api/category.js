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

let pushChildToTermInCollection = function (termId, termCollection, childTerm) {
  return _.map(termCollection, term=> {
    if (term.id === termId) {
      if (has(term, 'childCollection')){
        term.childCollection.push(childTerm)
      }else{
        term.childCollection = []
        term.childCollection.push(childTerm)
      }
      return term
    } else {
      return term
    }
  })
}

let find = function (params, cb, next) {
  if (this.collections) {
    let query = {taxonomy: 'category', parent: 0}
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
          if (_.isArray(collection)) {
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
                  cb(error, termCollection, next)
                })

            } else {

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
          if (_.isArray(collection)) {
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
                  cb(error, termCollection, next)
                })

            } else {

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
    let query = {taxonomy: 'category', parent: 0}
    let termIdCollection = []
    let childTermIdCollection = []

    this.collections
      .termtaxonomy
      .find()
      .where(query)
      .populate('term')
      .populate('childCollection')
      .exec((err, collection)=> {
        if (err) {
          cb(err, collection, next)
        } else {
          if (_.isArray(collection)) {
            //console.log('findWithChildren -> collection', collection)
            collection.map(termTax=> {
              termIdCollection.push(termTax.term.id)
              if (has(termTax, 'childCollection')) {
                if (_.isArray(termTax.childCollection)) {
                  termTax.childCollection.map(childTermTax=> {
                    termIdCollection.push(childTermTax.term)
                    childTermIdCollection.push({termId: childTermTax.term, parent: termTax.term.id})
                  })
                }
              }
            })
            if (termIdCollection.length > 0) {
              params = assign({id: termIdCollection}, params)
              this.collections
                .term
                .find()
                .where(params)
                .exec((error, termCollection)=> {

                  if (error) {
                    cb(error, termCollection, next)
                  } else {

                    if (termCollection) {
                      let resultTermCollection = []
                      let resultChildTermCollection = []

                      termCollection.map(term=> {
                        let currentTermTax = _.find(childTermIdCollection, {termId: term.id})
                        if (!currentTermTax) {
                          resultTermCollection.push(merge(term, {childCollection: []}))
                        } else {
                          resultChildTermCollection.push(merge(term, {parent: currentTermTax.parent}))
                        }
                      })

                      resultChildTermCollection.map(childTerm=> {
                        resultTermCollection = pushChildToTermInCollection(childTerm.parent, resultTermCollection, childTerm)
                      })

                      cb(error, resultTermCollection, next)

                    } else {
                      cb(error, termCollection, next)
                    }
                  }

                })

            } else {

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
let one = function (params, cb, next) {
  if (this.collections) {
    let query = {taxonomy: 'category'}
    //query = assign(params, query)
    //termApi.byTaxonomy.call(this, query, function (err, collection) {
    this.collections
      .term
      .find()
      .where(params)
      //.populate('term')
      .exec((err, collection)=> {
        cb(err, collection, next)

      })
    //}, next)
  } else {
    cb('Not connected', null, next)
  }
}

//main
export default {find, findChildren, findWithChildren, one}
