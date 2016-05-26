var mongoose = require("mongoose");
var repo = module.exports = {};
var pkgSchema = mongoose.Schema({
  name: {type: String, index: true},
  url: String
});

var pkgModel = mongoose.model("Package", pkgSchema);

repo.connect = function() {
  mongoose.connect('mongodb://localhost:27017/p2-playground', function(error) {
    if(error) {
      console.error("Mongoose Connection Failed.");
      console.log(error);
    }
    else {
      console.log("Mongoose Connected!");
    }
  });
};

repo.getPackage = function(pName, req, res) {
  var query = undefined;
  if(pName) {
    query = {name: pName};
  }
  pkgModel.find(query, function(err, packages) {
    if(err){
      res.status(500).send(err);
      return console.error(err);
    }
    // return single unique entry
    if(pName && packages.length > 0) {
      res.send(packages[0]);
      return;
    }
    // if uniqueness fails return all
    res.send(packages);
    return;
  });
};

repo.registerPackage = function(pName, pUrl, req, res) {
  pkgModel.find({name: pName}, function(err, packages) {
    if(err){
      res.status(500).send(err);
      return console.error(err);
    }
    // return error if package name is used already
    if(packages.length > 0) {
      res.status(400).send("Package Name Exists, Try Again!");
      return console.error("ERROR: Package Name Exists, Try Again!");;
    }
    // save package if name is unique
    var pkg = new pkgModel({name: pName, url: pUrl});
    console.log(pName);
    pkg.save(function(e, pkg) {
      if(e) {
        res.status(500).send(e);
        return console.error(e);
      }
      res.status(201).send("created");
      return;
    });
  });
};
