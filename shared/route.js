const rs = require('randomstring');
const fs = require('fs');
const express = require('express');

module.exports = function(app, name, dirname) {
  const root = `/${name}`;
  const html = fs.readFileSync(`${dirname}/page.html`, 'utf8').replace(/{{root}}/g, root).replace(/{{name}}/g, name);
  const sw = fs.readFileSync(`${dirname}/sw.js`, 'utf8');
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
}

/*
const express = require('express');
const rs = require('randomstring');
const fs = require('fs');
const app = express();

const html = fs.readFileSync('./index.html');
const sw = fs.readFileSync('./sw.js', 'utf8');
const noop = fs.readFileSync('./noop.js');

function generateVersion() {
  return rs.generate(5);
}

let version = generateVersion();
let killed = false;

function updateVersion() {
  version = generateVersion();
}

app.get('/', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.send(html);
});

app.get('/update', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.send('<html>Updated</html>');
  updateVersion();
});

app.get('/kill', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.send('<html>Killed</html>');
  killed = true;
});

app.get('/unkill', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.send('<html>Unkilled</html>');
  killed = false;
});

app.get('/pulse', function (req, res) {
  if (killed) {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
});

app.get('/sw.js', function (req, res) {
  res.set('Content-Type', 'text/javascript');
  if (!killed) {
    res.send(sw.replace('%VERSION%', version));
  } else {
    res.send(noop);
  }
});

app.get('/asset.js', function (req, res) {
  res.set('Content-Type', 'text/javascript');
  res.send(`console.log('${version}')`);
});
*/