(function() {
  'use strict';

  const fs = require('fs');
  const fse = require('fs-extra');
  const rimraf = require('rimraf');
  const Zip = require('adm-zip');
  const uuid = require('node-uuid');

  const strapboot = require('strapboot');

  const express = require('express');
  const bodyParser = require('body-parser');
  const ejs        = require('ejs');

  const port = process.env.PORT || 6789;
  const encoding = 'utf-8';
  const base = `${__dirname}/temp`;

  let app = express();

  app.use(express.static(__dirname + '/public'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(bodyParser.text({ type: 'text/html' }));

  app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
  });

  app.post('/', (req, res) => {
    let answers = req.body;
    let id = uuid.v4();
    let dir = `${base}/${id}`;
    let files = new Zip();
    strapboot(answers, dir).then(() => {
      files.addLocalFolder(dir);
      files = files.toBuffer();
      res.setHeader('Content-disposition', `attachment; filename=${answers.name}.zip`);
      res.setHeader('Content-type', 'application/zip');
      res.send(files);
      rimraf.sync(dir);
    });
  });

  let server = app.listen(port, () => {
    console.log('Listening on port %d', server.address().port);
  });

})();
