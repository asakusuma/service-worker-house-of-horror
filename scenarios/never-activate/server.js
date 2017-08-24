const route = require('./../../shared/route');
const name = 'never-activate';
module.exports = {
  route: route(name, __dirname),
  name
};