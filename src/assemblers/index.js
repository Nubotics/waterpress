//util
import {
  find,
  filter,
  has,
  assign,
  forEach,
  merge,
  eachKey,
  findValue,
  makeObject,
  sortBy,

} from '../core/util'

const assemble = {
  user: {
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
          if (has(user.metaObj, 'nio_avatar')) {
            user.avatar = user.metaObj.nio_avatar
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
          foundChild = find(collection, {'id': childItem.id})
          if (foundChild) {
            subCollection.push(assemble.category.entity(foundChild, activityCollection, false))
          }
        })
      } else {
        let childCollection = filter(collection, {parent: category.termId})
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
        result = merge(result, {subCollection: item.subCollection})
      }
      if (activityCollection) {
        let currFollow = find(activityCollection,
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
      result = sortBy(result, 'name')
      return result

    },
    flatCollection (categoryCollection, activityCollection) {
      let result = category.collection(categoryCollection, activityCollection, true)
      return result
    },
    detailCollection(collection, termCollection){

      //console.log('assembler -> category -> detailCollection -> collection, termCollection', collection, termCollection)

      let newCollection = []
      let newItem = undefined
      let newChildCollection = []
      let newChildItem = undefined
      let termItem = undefined
      let detailChildItem = undefined

      forEach(collection, ogItem=> {

        //-> find ogItem in term collection
        termItem = find(termCollection, {id: ogItem.term.id})
        if (termItem) {
          newChildCollection = []

          //-> if -> has -> childCollection
          if (has(ogItem, 'childCollection')
            && has(termItem, 'childCollection')) {

            //--> each child -> merge ->  new child item
            forEach(ogItem.childCollection, ogChildItem=> {
              if (!ogChildItemTermId) ogChildItemTermId = 0
              detailChildItem = find(termItem.childCollection, {id: ogChildItem.id})
              if (detailChildItem) {
                newChildItem = merge(detailChildItem, ogChildItem)
              } else {
                newChildItem = ogChildItem
              }
              newChildCollection.push(newChildItem)
            })
          }

          let {
            id,
            description,
            taxonomy,
            parent,

            } = ogItem
          let {
            slug,
            name,
            group,

            } = termItem

          newItem = {
            id: termItem.id,
            taxonomyId: id,
            slug,
            name,
            description,
            taxonomy,
            parent,
            group,
            childCollection: newChildCollection
          }
          //-> push new item to new collection
          newCollection.push(newItem)
        }
        //-> else &&
        else {
          newCollection.push(ogItem)
        }

      })
      //-> return
      console.log('assembler -> category -> return -> newCollection', newCollection)

      return newCollection
    },
    collectionWithChildren(collection){
      let newCollection = []
      let newItem = {}
      forEach(collection, item=> {
        let {
          term,
          taxonomy,
          description,
          parent,
          id,
          childCollection,
          } = item

        let {
          slug, name,group,
          } = term

        newItem = {
          id: term.id,
          taxonomyId: id,
          slug,
          name,
          group,
          description,
          taxonomy,
          parent,
          childCollection,
        }
        newCollection.push(newItem)
      })
      return newCollection
    },
  },
  comment: {
    single(comment){
      if (has(comment,'metaCollection')){
        comment.metaObj = makeObject(comment.metaCollection)
      }
      return comment
    },
    collection(commentCollection){
      let collection = []
      forEach(commentCollection, comment=>{
        collection.push(assemble.comment.single(comment))
      })
      return collection
    },
  },
}

export default assemble
