//util
import {
  _,
  has,
  assign,
  merge,
  eachKey,
  findValue,

} from '../core/util'

const assemble = {
  category: {
    top (item, collection, termMetaCollection, activityCollection) {
      let foundTermMeta = _.filter(termMetaCollection, {term: item.term.id})
      let category = {
        termId: item.term.id,
        taxonomyId: item.id,
        parent: item.parent,
        name: item.term.name,
        slug: item.term.slug,
        metaObj: makeObj(foundTermMeta)
      }
      let subCollection = []
      let foundChild = null
      if (item.childCollection.length > 0) {
        item.childCollection.map(childItem=> {
          foundChild = _.find(collection, {'id': childItem.id})
          if (foundChild) {
            subCollection.push(assemble.category.entity(foundChild, null, activityCollection, false))
          }
        })
      } else {
        let childCollection = _.filter(collection, {parent: category.termId})
        if (childCollection) {
          childCollection.map(childItem=> {
            subCollection.push(assemble.category.entity(childItem, null, activityCollection, false))
          })
        }
      }
      category.subCollection = subCollection
      return category
    },
    entity (item, termMetaCollection, activityCollection, isFlat) {
      let result = {
        termId: item.term.id,
        taxonomyId: item.id,
        parent: item.parent,
        name: item.term.name,
        slug: item.term.slug,
        isFollowed: false
      }
      if (termMetaCollection) {
        let foundTermMeta = _.filter(termMetaCollection, {term: item.term.id})
        result = _.extend(result, {metaObj: makeObj(foundTermMeta)})
      }
      if (!isFlat) {
        if (has(item,'subCollection')){
          result = _.extend(result, {subCollection: item.subCollection})
        }
      }
      if (activityCollection) {
        let currFollow = _.find(activityCollection,
          {following_term_id: item.termId})
        if (currFollow) {
          result.isFollowed = true
        }
      }
      return result
    },
    collection (collection, termMetaCollection, activityCollection, isFlat) {
      let result = []
      collection.map(item => {
        if (!isFlat) {
          if (item.parent == 0){
            result.push(assemble.category.top(item, collection, termMetaCollection))
          }
        } else {
          result.push(assemble.category.entity(item, termMetaCollection, activityCollection, isFlat))
        }
      })
      result = _.sortBy(result,'name')
      return result

    }
  }
}

export default assemble
