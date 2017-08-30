const setup = require('./../../shared/route');
const name = 'infinity';
module.exports = {
  route(app) {
    setup(app, name, __dirname);
  },
  name
};