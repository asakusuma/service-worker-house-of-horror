const rs = require('randomstring');
const fs = require('fs');
const express = require('express');
const name = 'never-activate';
module.exports = {
  route(app) {
    const root = `/${name}`;
    const html = fs.readFileSync(`${__dirname}/page.html`, 'utf8').replace(/{{root}}/g, root).replace(/{{name}}/g, name);
    const sw = fs.readFileSync(`${__dirname}/sw.js`, 'utf8');
    const noop = fs.readFileSync('./shared/noop.js');
    const router = express.Router();
    function generateVersion() {
      return rs.generate(5);
    }
    
    let version = generateVersion();
    let killed = false;
    
    function updateVersion() {
      version = generateVersion();
    }
  
    router.get('/', (req, res) => {
      console.log('respond with html');
      res.set('Content-Type', 'text/html');
      res.send(html);
    });
    router.get('/update', function (req, res) {
      res.set('Content-Type', 'text/html');
      res.send('<html>Updated</html>');
      updateVersion();
    });
    router.get('/kill', function (req, res) {
      res.set('Content-Type', 'text/html');
      res.send('<html>Killed</html>');
      killed = true;
    });
    router.get('/unkill', function (req, res) {
      res.set('Content-Type', 'text/html');
      res.send('<html>Unkilled</html>');
      killed = false;
    });
    router.get('/sw.js', function (req, res, next) {
      console.log(`serve ${name} sw.js`);
      res.set('Content-Type', 'text/javascript');
      if (!killed) {
        res.send(sw.replace('%VERSION%', version));
      } else {
        res.send(noop);
      }
    });
  
    app.use(root, router);
  },
  name
};