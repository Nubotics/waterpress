//util
import {
  _,
  has,
  assign,
  forEach,
  merge,
  eachKey,
  findValue,

} from '../core/util'

//models
import { termMeta, term } from './models'
//api
import { categoryApi } from './api'

//plugin
const pluginWpCategoryMeta = {
  name: 'nio-press-community',
  modelCollection: [termMeta],
  //apiCollection: [],
  //-> overrides
  override: {
    model: {term},
    api: {category: categoryApi}
  }
}

//exports
export default pluginWpCategoryMeta
