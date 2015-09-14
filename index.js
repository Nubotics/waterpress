var env = require('get-env')({
  development: ['development', 'dev', 'local'],
  production: ['production', 'prod', 'live', 'staging']
})



if (env === 'production'){
  module.exports = require('./lib/index');
}else{
  module.exports = require('./src/index');
}

module.exports.env = env;