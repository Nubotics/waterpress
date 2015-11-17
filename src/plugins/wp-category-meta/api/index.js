//util
import { pluginUtils } from '../../../addons'
let {
  _,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObjectFromKeyCollection,
  merge,

  } = pluginUtils

//api
let categoryApi = {
  namespace: 'category',
  methods: {
    all(params, cb, next){

    }
  }
}

export default {
  categoryApi,

}
