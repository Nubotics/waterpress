import striptags from 'striptags'
import truncate from 'html-truncate'

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

// cateogry

/*
*
* Assemble category
*
* */

/*
const checkHasPassport = (userObj)=> {
  let result = false
  if (_.has(userObj, 'passportCollection')) {
    //console.log('CHECKHASPASSPORT', userObj.passportCollection.length, userObj.passportCollection)
    if (userObj.passportCollection.length > 0)
      result = true
  }
  return result
}

const guaranteePassword = (userObj) => {
  let result = generatePassword()
  if (_.has(userObj, 'password')) {
    if (userObj.password.length > 5) {
      result = userObj.password
    }
  }
  return result
}

const assembleUser = (userObj)=> {
  let {
    firstName,
    lastName,
    email,
    password,
    url,

    } = userObj
  let proxyUser = {
    //id: 0,
    slug: `${userObj.firstName}-${userObj.lastName}`,
    displayName: `${userObj.firstName} ${userObj.lastName}`,
    userName: email,
    email,
    password,
    registeredAt: new Date(),
    status: 0,
    url,
    metaCollection: [
      {
        //id: 0,
        //user: 0,
        key: 'nickname',
        value: userObj.firstName
      },
      {
        key: 'first_name',
        value: userObj.firstName
      },
      {
        key: 'last_name',
        value: userObj.lastName
      },
      {
        key: 'mobile',
        value: userObj.mobile
      },
      {
        key: 'description',
        value: ''
      },
      {
        key: 'nio_profile_picture',
        value: userObj.avatar
      },
      {
        key: 'wp_capabilities',
        value: 'a:1:{s:10:"subscriber";b:1;}'
      },
      {
        key: 'wp_user_level',
        value: '0'
      }
    ]
  }

  proxyUser.metaCollection = _.extend(proxyUser.metaCollection,
    userObj.metaCollection)

  if (hasPassport) {
    proxyUser.passportCollection = userObj.passportCollection
  } else {
    proxyUser.passportCollection = []
  }

  return proxyUser
}

*/


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
            result.push(assemble.category.top(item, collection, termMetaCollection))
          }
        } else {
          result.push(assemble.category.entity(item, termMetaCollection, activityCollection, isFlat))
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
  profile: {
    entity (profile, activityCollection) {

      let result = {
        id: profile.id,
        slug: profile.slug,
        displayName: '',
        firstName: '',
        lastName: '',
        mobile: '',
        avatar: '',
        followCount: 0,
        isFollowed: false,
        description: ''
      }

      if (_.has(profile, 'firstName')) {
        result.firstName = profile.firstName
        result.displayName = profile.firstName
      }

      if (_.has(profile, 'lastName')) {
        result.lastName = profile.lastName
        result.displayName += ` ${profile.lastName}`
      }

      if (_.has(profile, 'description')) {
        result.description = profile.description
      }

      if (_.has(profile, 'metaObj')) {

        if (_.has(profile.metaObj, 'nio_profile_picture')) {
          result.avatar = profile.metaObj.nio_profile_picture
        } else if (_.has(profile.metaObj, 'cupp_upload_meta')) {
          result.avatar = profile.metaObj.cupp_upload_meta
        } else if (_.has(profile.metaObj, 'profile_picture')) {
          result.avatar = profile.metaObj.profile_picture
        }

        if (result.displayName.length === 0) {
          if (_.has(profile.metaObj, 'first_name')) {
            result.firstName = profile.metaObj.first_name
            result.displayName = profile.metaObj.first_name
          }
          if (_.has(profile.metaObj, 'last_name')) {
            result.lastName = profile.metaObj.last_name
            result.displayName += ` ${profile.metaObj.last_name}`
          }
        }

        if (result.description.length === 0) {
          if (_.has(profile.metaObj, 'description')) {
            result.description = profile.metaObj.description
          }
        }

        if (_.has(profile.metaObj, 'mobile')) {
          profile.mobile = profile.metaObj.mobile
        }

      }

      if (result.description.length === 0) {
        result.firstName = profile.displayName
        result.displayName = profile.displayName
      }

      if (_.has(profile, 'followersCollection')) {
        if (profile.followersCollection) {
          if (_.isArray(profile.followersCollection)) {
            result.followCount = profile.followersCollection.length
          }
        }
      }

      if (activityCollection) {
        let currFollow = _.find(activityCollection, {following_user_id: result.id})
        if (currFollow) {
          result.isFollowed = true
        }
      }

      return result

    }
  },
  story: {
    makeExcerpt (content) {
      let result = striptags(content)
      result = truncate(result, 100)
      return result
    },
    findPostCategory (rel, categoryCollection) {
      let collection = []

      let result = _.filter(categoryCollection, {'taxonomyId': rel.termTaxonomy})
      //console.log('FIND CATEGORY', result)
      if (result) {
        if (_.isArray(result)) {
          collection = collection.concat(result)
        } else {
          collection = collection.push(result)
        }

      }
      categoryCollection.map((cat)=> {
        if (_.has(cat, 'subCollection')) {
          result = _.filter(cat.subCollection, {'taxonomyId': rel.termTaxonomy})
          //console.log('FIND CATEGORY subCollection', result)
          if (result) {
            if (_.isArray(result)) {
              collection = collection.concat(result)
            } else {
              collection = collection.push(result)
            }

          }
        }
      })


      //console.log('FIND CATEGORY',rel, categoryCollection, collection)

      return collection
    },
    entity (post, attachmentCollection, formatCollection, userCollection, postCounts, activityCollection) {
      //console.log('ASSEMBLE STORY', post)
      let author = null
      if (_.has(post.author, 'id')) {
        author = _.find(userCollection, {id: post.author.id})
        //console.log('FIND AUTHOR', post.author, author, userCollection)
        if (!author) author = post.author
      }

      let likes = 0
      let isLiked = false
      let bookmarks = 0
      let isBookmarked = false
      let shares = 0
      let trendingScore = 0

      if (postCounts) {
        postCounts.map(count=> {
          if (count.likeCount) likes = count.likeCount
          if (count.bookmarkCount) bookmarks = count.bookmarkCount
          if (count.shareCount) shares = count.shareCount
        })

        trendingScore = likes + bookmarks + shares
      }

      let postFormat = ''
      let currFormat = null
      if (_.has(post, 'relationshipCollection')) {
        //if (post.title == 'gallery') console.log('gallery relationships', post.relationshipCollection)
        _.forEach(post.relationshipCollection, relationship=> {
          currFormat = _.find(formatCollection, {taxonomyId: relationship.termTaxonomy})
          if (currFormat) {
            postFormat = currFormat.slug
            return false
          }
        })

      }
      if (activityCollection) {
        let currBookmark = null
        let currLike = null
        let currFollow = null

        currBookmark = _.find(activityCollection, {bookmark_post_id: post.id})
        if (currBookmark) {
          isBookmarked = true
        }

        currLike = _.find(activityCollection, {like_post_id: post.id})
        if (currLike) {
          isLiked = true
        }

        if (author) {
          currFollow = _.find(activityCollection, {following_user_id: author.id})
          if (currFollow) {
            author.isFollowed = true
          }
        }

      }

      let story = {
        //straight map
        id: post.id,
        slug: post.slug,
        title: post.title,
        postType: post.postType,
        excerpt: assemble.story.makeExcerpt(post.content),
        content: post.content,
        featuredImage: {},
        status: post.status,
        postDate: post.postDate,
        updatedAt: post.updatedAt,
        author,
        categoryCollection: post.categoryCollection,
        metaObj: makeObject(post.metaCollection),
        likes,
        bookmarks,
        shares,
        trendingScore,
        isBookmarked,
        isLiked,
        latestActivityName: '',
        postFormat
      }

      if (_.has(story.metaObj, '_thumbnail_id')) {
        let featureImg = _.find(attachmentCollection, {'id': parseInt(story.metaObj._thumbnail_id)})
        if (featureImg) {
          story.featuredImage = {
            id: featureImg.id,
            url: featureImg.guid,
            mimeType: featureImg.mimeType
          }
        }
      }


      return story
    },
    collection (postCollection, attachmentCollection, formatCollection, categoryCollection, userCollection, activityCounts, activityCollection) {
      let storyCollection = []
      let currCat = null
      let postCounts = null
      postCollection.map(post=> {


        let catCollection = []

        if (_.has(post, 'relationshipCollection')) {
          post.relationshipCollection.map(rel=> {

            currCat = assemble.story.findPostCategory(rel, categoryCollection)
            //console.log('CURRENT CAT', currCat)
            if (currCat) {
              if (_.isArray(currCat)) {
                catCollection = catCollection.concat(currCat)
              } else {
                catCollection.push(currCat)
              }

            }

          })

        }

        postCounts = _.filter(activityCounts, {'ID': post.id})

        post.categoryCollection = catCollection

        storyCollection.push(assemble.story.entity(post, attachmentCollection, formatCollection, userCollection, postCounts, activityCollection))


      })

      return storyCollection
    }

  }

}

export default assemble
