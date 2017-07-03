const mongoose = require('mongoose');
const Session = require('./index').session;
const Location = require('./index').location;
const Attendee = require('./index').attendee;
const Recommendation = require('./index').recommendation;

// mongoose.connect('mongodb://localhost/sessions', { useMongoClient: true });
mongoose.connect('mongodb://localhost/sessions');
var db = mongoose.connection;
// console.log('db: ', db);

//db.dropDatabase();

var testDate = new Date('2015/03/25');
var recommendResult = new Recommendation({
  name: "Jeffrey's Gaming Emporium",
  address: '1011 Jeff Lane, Jefftropolis, CA 88888',
  iframe_string: 'https://www.google.com/maps/dir/370+Treasure+Island+Drive,+Belmont,+CA/120+Overstreet+Ct,+Palm+Harbor,+FL+34683/@27.2766675,-139.4889684,3z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x808f9f35cb8b92db:0x57b677549fe46e18!2m2!1d-122.269978!2d37.533536!1m5!1m1!1s0x88c2f2f402fd067d:0xee37cc456a6e8f19!2m2!1d-82.7615223!2d28.0671624',
  photo_url: 'http://dakotapethospital.com/clients/14546/images/pile_of_puppies.jpg'
  //ETC
});

var sessionTest = new Session({
  session_type: 'meet with others',
  initiator_name: 'Pauly Diesel',
  event_name: 'SmashBros with Bros',
  location_type: 'barcade', //for api search term
  locations: ['123 Fake St, PaulsVille, FL 11111', '456 Real Ave, JonsHamlet, FL 22222'],  
  center_coordinates: '40.714224,-73.961452',
  recommended_destination: recommendResult,
  // recommended_destination: '789 Wilson Way, WilsonTown, CA 33333',
  init_time: testDate
});

//console.log('sessionTest: ', sessionTest);

sessionTest.save(function(err) {
  if (err) { return console.error('Error: ', err); }
  console.log('sessionTest saved');
});

Session.find({}, function(err, sessions) {
  if (err) { return console.error('Error: ', err); }
  console.log('sessions: ', sessions);
});


//*****************Stretch Implementations***************************//
// var paulLocation = new Location({
//   latitude: 1,
//   longitude: 2,
//   street_address: '123 Fake St',
//   city: 'PaulsVille',
//   state: 'FL',
//   zipcode: '11111',
//   country: 'Sweden'
// });

// var jonLocation = new Location({
//   latitude: 3,
//   longitude: 4,
//   street_address: '456 Real Ave',
//   city: 'JonsHamlet',
//   state: 'FL',
//   zipcode: '22222',
//   country: 'Snoreway'
// });

// var centerLocation = new Location({
//   latitude: 5,
//   longitude: 6,
//   street_address: '789 Wilson Way',
//   city: 'WilsonTown',
//   state: 'CA',
//   zipcode: '33333',
//   country: 'NotHongKong'
// });


//console.log('paulLocation: ', paulLocation);
//console.log('jonLocation: ', jonLocation);

// paulLocation.save(function(err) {
//   if (err) { return console.error('Error: ', err); }
//   console.log('PaulSaved');
// });

// jonLocation.save(function(err) {
//   if (err) { return console.error('Error: ', err); }
//   console.log('JonSaved');
// });

// Location.find({}, function(err, locations) {
//   if (err) { return console.error('Error: ', err); }
//   console.log('locations: ', locations);
// });



// let locationRes = Location.findOne({ 'latitude': 1 }, 'longitude', function(err, location) {
//   if (err) { return console.error('Error: ', err); }
//   console.log('in findOne method');
// });

// console.log('locationsRes: ', locationsRes);
// console.log('locationRes: ', locationRes);

// let paulLocationQuery = Location.findOne({
//   street_address: '123 Fake St'
// });

// paulLocationQuery.select('street_address city state zipcode');

// paulLocationQuery.exec(function(err, location) {
//   if (err) { console.error(err); }
//   console.log('Address from db:\n%s\n%s, %s %s');
// });

