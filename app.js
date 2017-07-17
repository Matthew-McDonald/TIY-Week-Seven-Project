const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mustacheExpress = require("mustache-express");
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const bcrypt = require("bcryptjs");

// const passport = require('passport');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect("mongodb://localhost/stattracker");

Activity = require("./models/activities");
User = require("./models/user");

// Authentication Section DONT DELETE********************
// example of modifying new password
// var user = User.findOne({name: "mattmcd"}, function(err, user){
//   user.password = 'test';
//   user.save(function(err){
//     if (err) {return console.log('user not saved')}
//     console.log('user saved!')
//   })
// });

passport.use(
  new BasicStrategy(function(username, password, done) {
    User.findOne({ name: username }, function(err, user) {
      console.log("User Check");
      if (user && bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      }
      return done(null, false);
    });
  })
);

//api authentication for passport
app.get(
  "/api/auth",
  passport.authenticate("basic", { session: false }),
  function(req, res) {
    res.send("You have been authenticated, " + req.user.name);
  }
);

//Tells the client to use the correct home route
app.get("/", function(req, res) {
  res.send("Please use /api/...");
});

//Gets all the activities that are being tracked
app.get(
  "/api/activities",
  passport.authenticate("basic", { session: false }),
  function(req, res) {
    Activity.getActivities(function(err, activities) {
      if (err) {
        throw err;
      }
      res.json(activities);
    });
  }
);

//Creates new activity
app.post(
  "/api/activities",
  passport.authenticate("basic", { session: false }),
  function(req, res) {
    var activity = req.body;
    Activity.addActivity(activity, function(err, activity) {
      if (err) {
        throw err;
      }
      res.json(activity);
    });
  }
);

//Show information about one id
app.get(
  "/api/activities/:_id",
  passport.authenticate("basic", { session: false }),
  function(req, res) {
    Activity.getActivityById(req.params._id, function(err, activity) {
      if (err) {
        throw err;
      }
      res.json(activity);
    });
  }
);

//Updates an activity by id
app.put(
  "/api/activities/:_id",
  passport.authenticate("basic", { session: false }),
  function(req, res) {
    var id = req.params._id;
    var activity = req.body;
    Activity.updateActivity(id, activity, {}, function(err, activity) {
      if (err) {
        throw err;
      }
      res.json(activity);
    });
  }
);

//Deletes an activity by id
app.delete(
  "/api/activities/:_id",
  passport.authenticate("basic", { session: false }),
  function(req, res) {
    var id = req.params._id;
    Activity.removeActivity(id, function(err, activity) {
      if (err) {
        throw err;
      }
      res.json(activity);
    });
  }
);

//Finds activity by name

app.get('/api/activities/name/:name', passport.authenticate('basic', {session: false}), function(req, res){
  Activity.getActivityByName(req.params.name, function(err, activity){
    if(err){
      throw err;
    }
    res.json(activity);
  });
});


//Pulls activity by stat
app.get('/api/activities/stat/:stat', passport.authenticate('basic', {session: false}), function(req, res){
  Activity.getActivityByStat(req.params.stat, function(err, activity){
    if(err){
      throw err;
    }
    res.json(activity);
  });
});


//Listen for port 27017, must match the port mongod is using

app.listen(27017, function(req, res) {
  console.log("Up and running!");
});
