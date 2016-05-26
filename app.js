var express = require("express");
var bodyParser = require("body-parser");
var repo = require("./services/db.js");
var app = express();

repo.connect();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var server = app.listen(8392, function() {
  console.log("p2-playground server running on localhost:8392");
});

app.get("/", express.static('public'));

app.get("/packages/:name?", function(req, res) {
  repo.getPackage(req.params.name, req, res);
});

app.post("/packages", function(req, res) {
  repo.registerPackage(req.body.name, req.body.url, req, res);
});
