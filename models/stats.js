var mongoose = require('mongoose');


var statSchema = mongoose.Schema({
  stat:{
    type:String,
    required: true
  }
});

var Stat = module.exports = mongoose.model('Stat', statSchema);


// Add stat by id
module.exports.updateStat = function(id, stat, options, callback){
  var query = {_id: id};
  var update = {
    stat: activity.stat
  }
  Stat.findOneAndUpdate(query, update, options, callback);
}
