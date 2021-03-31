const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const upload = require('./startup/multer')();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

const corsOptions = {
    exposedHeaders: 'x-auth-token',
    'Access-Control-Allow-Origin': '*',
};

morganBody(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
    console.log(`Listening on port ${port}...`)
);

module.exports = server;
