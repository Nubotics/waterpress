/**
 * Created by nubuck on 15/07/10.
 */

let _ = require('lodash')
const hasher = require('wordpress-hash-node')

let findValue = function (collection, keys) {
  let result = null
  let item = null
  if (_.isArray(keys)) {
    result = {}
    _.forEach(keys, (key)=> {
      item = _.find(collection, {'key': key})
      if (_.has(item, 'value')) {
        result = _.extend(result, {[key]: item.value})
      }
    })
  } else {
    item = _.find(collection, {'key': keys})
    if (_.has(item, 'value')) {
      result = {[keys]: item.value}
    }
  }
  return result
}

let makeObjectFromKeyCollection = function (collection) {
  let result = {}
  _.forEach(collection, (item) => {
    //console.log('make from collection:', item)
    if (_.has(item, 'key') && _.has(item, 'value')) {
      result = _.extend(result, {[item.key]: item.value})
    }
  })
  return result
}

export {_,findValue,makeObjectFromKeyCollection, hasher}
