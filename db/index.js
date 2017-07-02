var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost/sessions', { useMongoClient: true });

var locationSchema = new Schema({
  latitude: Number,
  longitude: Number,
  street_address: String
});

var recommendSchema = new Schema({
  name: String,
  address: String,
  iframe_string: String,
  photo_url: String
});

var sessionSchema = new Schema({
  // id: { type: Number, unique: true },
  // session_type: String,
  session_type: { 
    type: String,
    enum: [
      'meet with others',
      'find central command'
    ]
  },
  initiator_name: String,
  location_type: String, //for api search term
  phone_numbers: [String],
  // locations: [locationSchema],
  midpoint_coordinates: String,
  recommended_destinations: [recommendSchema]
});

var attendeeSchema = new Schema({
  id: { type: Number, unique: true },
  location: [String],
  // location: locationSchema,
  name: String,
  phone_number: String
});


var Session = mongoose.model('Session', sessionSchema);
// var Location = mongoose.model('Location', locationSchema);
// var Attendee = mongoose.model('Attendee', attendeeSchema);
var Recommendation = mongoose.model('Recomendation', recommendSchema);

module.exports = {
  session: Session,
  // location: Location,
  // attendee: Attendee//,
  recommendation: Recommendation
};