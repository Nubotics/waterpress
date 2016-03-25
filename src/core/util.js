import tools from 'nio-tools'
import uuid from 'node-uuid'
const generateUuid = function(){
  return uuid.v1()
}
export default {generateUuid, ...tools}
