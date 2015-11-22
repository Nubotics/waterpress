//util
import {
  _,
  has,
  assign,
  forEach,
  merge,
  eachKey,
  findValue,
  makeObjectFromKeyCollection,

} from '../core/util'

const assemble = {
  user:{
    entity(user){
      if (user) {
        user.firstName = ''
        user.lastName = ''
        user.nickname = ''
        user.description = ''
        if (has(user, 'password')) {
          delete user.password
        }
        if (has(user, 'metaObj')) {
          if (has(user.metaObj, 'first_name')) user.firstName = user.metaObj.first_name
          if (has(user.metaObj, 'last_name')) user.lastName = user.metaObj.last_name
          if (has(user.metaObj, 'nickname')) user.nickname = user.metaObj.nickname
          if (has(user.metaObj, 'description')) user.description = user.metaObj.description
          if (has(user.metaObj, 'mobile')) user.mobile = user.metaObj.mobile
          if (has(user.metaObj, 'nio_profile_picture')) {
            user.avatar = user.metaObj.nio_profile_picture
          } else if (has(user.metaObj, 'cupp_upload_meta')) {
            user.avatar = user.metaObj.cupp_upload_meta
          }
          return user
        } else {
          return user
        }
      } else {
        return user
      }
    }
  },
  category: {
    top (item, collection, activityCollection) {
      let category = {
        termId: item.term.id,
        taxonomyId: item.id,
        parent: item.parent,
        name: item.term.name,
        slug: item.term.slug
      }
      let subCollection = []
      let foundChild = null
      if (item.childCollection.length > 0) {
        item.childCollection.map(childItem=> {
          foundChild = _.find(collection, {'id': childItem.id})
          if (foundChild) {
            subCollection.push(assemble.category.entity(foundChild, activityCollection, false))
          }
        })
      } else {
        let childCollection = _.filter(collection, {parent: category.termId})
        if (childCollection) {
          childCollection.map(childItem=> {
            subCollection.push(assemble.category.entity(childItem, activityCollection, false))
          })
        }
      }
      category.subCollection = subCollection
      return category

    },
    entity (item, activityCollection, isFlat) {
      let result = {
        termId: item.term.id,
        taxonomyId: item.id,
        parent: item.parent,
        name: item.term.name,
        slug: item.term.slug,
        isFollowed: false
      }
      if (!isFlat) {
        result = _.extend(result, {subCollection: item.subCollection})
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
    collection (collection, activityCollection, isFlat) {

      let result = []
      collection.map(item => {
        if (!isFlat) {
          if (item.parent == 0) {
            result.push(assemble.category.top(item, collection, activityCollection))
          }
        } else {
          result.push(assemble.category.entity(item, activityCollection, isFlat))
        }
      })
      result = _.sortBy(result, 'name')
      return result

    },
    flatCollection (categoryCollection, activityCollection) {
      let result = category.collection(categoryCollection, activityCollection, true)
      return result
    }

  },


}

export default assemble
