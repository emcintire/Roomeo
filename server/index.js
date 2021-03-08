const express = require("express");
const app = express(); 
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');


require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();

app.use(bodyParser.json());
morganBody(app);


const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;