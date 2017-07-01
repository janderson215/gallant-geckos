var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/sessions', { useMongoClient: true });

var locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  street_address: String
});

var recommendSchema = new mongoose.Schema({
  name: String,
  address: String,
  iframe_string: String,
  photo_url: String
});

var sessionSchema = new mongoose.Schema({
  // id: { type: Number, unique: true },
  // session_type: String,
  session_type: { type: String,
                  enum: ['meet with others',
                         'find central command']
                },
  initiator_name: String,
  location_type: String, //for api search term
  phone_numbers: [String],
  // locations: [locationSchema],
  midpoint_coordinates: String, //depends on api format.
                          //Server makes call to google geocode first
  recommended_destinations: recommendSchema
});

var attendeeSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  location: [String],
  // location: locationSchema,
  name: String,
  phone_number: String
});


var Session = mongoose.model('Session', sessionSchema);
var Location = mongoose.model('Location', locationSchema);
var Attendee = mongoose.model('Attendee', attendeeSchema);
var Recommendation = mongoose.model('Recomendation', recommendSchema);

module.exports = {
  session: Session,
  location: Location,
  attendee: Attendee,
  recommendation: Recommendation
};