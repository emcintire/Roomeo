const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();

app.use(function(req, res, next){
    console.log(`${req.method} requrest for ${req.url}`);
    next();
});

app.get('/getjson', function(req, res){
    res.json(data);
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;