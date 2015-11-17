import _ from 'lodash'
import DeepMerge from 'deep-merge'

const assign = function (source, override) {
  return _.assign(_.clone(source), override)
}
const eachKey = function (object, cb) {
  _.forEach(Object.keys(object), (key, i) => {
    cb(key, i)
  })
}
const findValue = function (collection, keys) {
  let result = null
  let item = null
  if (_.isArray(keys)) {
    result = {}
    forEach(keys, (key)=> {
      item = _.find(collection, {'key': key})
      if (has(item, 'value')) {
        result = _.extend(result, {[key]: item.value})
      }
    })
  } else {
    item = _.find(collection, {'key': keys})
    if (has(item, 'value')) {
      result = {[keys]: item.value}
    }
  }
  return result
}
const forEach = _.forEach
const has = _.has
const makeObjectFromKeyCollection = function (collection) {
  let result = {}
  forEach(collection, (item) => {
    //console.log('make from collection:', item)
    if (has(item, 'key') && has(item, 'value')) {
      result = assign(result, {[item.key]: item.value})
    }
  })
  return result
}
const merge = DeepMerge(function (target, source, key) {
  if (target instanceof Array) {
    return [].concat(target, source);
  }
  return source;
})

export default {
  _,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObjectFromKeyCollection,
  merge,

}
