//util
import {

  has,
  assign,
  forEach,
  merge,
  eachKey,
  findValue,
  makeObject,

} from '../core/util'

const checkHasPassport = function (userObj) {
  let result = false
  if (has(userObj, 'passportCollection')) {
    //console.log('CHECKHASPASSPORT', userObj.passportCollection.length, userObj.passportCollection)
    if (userObj.passportCollection.length > 0)
      result = true
  }
  return result
}

const guaranteePassword = function (userObj) {
  let result = generatePassword()
  if (has(userObj, 'password')) {
    if (userObj.password.length > 5) {
      result = userObj.password
    }
  }
  return result
}

const assembleUser = function (userObj) {
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
        key: 'nio_avatar',
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

  proxyUser.metaCollection = assign(proxyUser.metaCollection,
    userObj.metaCollection)

  if (hasPassport) {
    proxyUser.passportCollection = userObj.passportCollection
  } else {
    proxyUser.passportCollection = []
  }

  return proxyUser
}

export default {
  checkHasPassport,
  guaranteePassword,
  assembleUser,

}

