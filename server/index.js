const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');
const fs = require('fs');
const path = require('path');
const upload = require('./startup/multer')();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

morganBody(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
    console.log(`Listening on port ${port}...`)
);

module.exports = server;
