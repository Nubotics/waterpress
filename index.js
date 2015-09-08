var env = require('get-env')({
  development: ['development', 'dev', 'local'],
  production: ['production', 'prod', 'live', 'staging']
})

module.exports.env = env;

if (env === 'production'){
  module.exports = require('./lib/index');
}else{
  module.exports = require('./src/index');
}
