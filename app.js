const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mustacheExpress = require('mustache-express');
// const passport = require('passport');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/stattracker');

Activity = require('./models/activities');


//Tells the client to use the correct home route
app.get('/', function(req, res){
  res.send('Please use /api/...');
});

//Gets all the activities that are being tracked
app.get('/api/activities', function(req, res){
  Activity.getActivities(function(err, activities){
    if(err){
      throw err;
    }
    res.json(activities);
  });
});

//Creates new activity
app.post('/api/activities', function(req, res){
  var activity = req.body;
  Activity.addActivity(activity, function(err, activity){
    if(err){
      throw err;
    }
    res.json(activity);
  });
});

//Show information about one id
app.get('/api/activities/:_id', function(req, res){
  Activity.getActivityById(req.params._id, function(err, activity){
    if(err){
      throw err;
    }
    res.json(activity);
  });
});

//Updates an activity by id
app.put('/api/activities/:_id', function(req, res){
  var id = req.params._id
  var activity = req.body;
  Activity.updateActivity(id, activity, {}, function(err, activity){
    if(err){
      throw err;
    }
    res.json(activity);
  });
});

//Deletes an activity by id
app.delete('/api/activities/:_id', function(req, res){
  var id = req.params._id
  Activity.removeActivity(id, function(err, activity){
    if(err){
      throw err;
    }
    res.json(activity);
  });
});

//Listen for port 27017, must match the port mongod is using

app.listen(27017, function(req, res){
  console.log("Up and running!");
});
