const express = require('express');
const globSync = require('glob').sync;
const servers = globSync('./scenarios/**/server.js', { cwd: __dirname }).map(require);

const app = express();

app.listen(3000);

servers.forEach(scenario => scenario.route(app));