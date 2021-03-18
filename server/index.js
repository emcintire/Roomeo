const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');
const fs = require('fs');
const path = require('path');

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

morganBody(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../client/src/components/pages/ImagesPage'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
    console.log(`Listening on port ${port}...`)
);

module.exports = server;
