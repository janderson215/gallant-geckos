const mongoose = require('mongoose');
const Session = require('./index').session;
const Location = require('./index').location;
const Attendee = require('./index').attendee;
const Recommendation = require('./index').recommendation;

const sampleData = require('../sampleOutputObject.js');
const pointsOfInterest = sampleData.pointsOfInterest;
const phoneNums = sampleData.phoneNums;

// console.log(sampleData[0].name)
// console.log('sampleOutputObject.js: ', sampleData)
// var data = sampleData[0];

mongoose.connect('mongodb://localhost/sessions');
var db = mongoose.connection;
// db.dropDatabase();

// API returns an array of object
// pass in object into Recommendation model to create instance of recommendResult data
var recommendResult = new Recommendation({
  name: pointsOfInterest.name,
  address: pointsOfInterest.vicinity,
  iframe_string: pointsOfInterest.iframe,
  photo_url: pointsOfInterest.photo
});

let saveRecommendResult = recommendResult.save(function(err) {
  if (err) { return console.error('Error: ', err); }
  console.log('sessionTest saved');
});

// API returns an array of object
// pass in object into Session model to create instance of session data
var session = new Session({
  session_type: 'meet with others', // default for MVP
  initiator_name: 'Wilson ', // ??? 
  location_type: 'coffee',
  phone_numbers: phoneNums,
  //recommended_destinations: [saveRecommendResult] //Paul removed invocation, but this needs to be passed an array of objects structured like the schema
});

let saveSessionModel = session.save(function(err) {
  if (err) { return console.error('Error: ', err); }
  console.log('sessionTest saved');
});

let findSession = Session.find({}, function(err, sessions) {
  if (err) { return console.error('Error: ', err); }
  console.log('sessions: ', sessions);
});

let findRecommend = Recommendation.find({}, function(err, sessions) {
  if (err) { return console.error('Error: ', err); }
  console.log('sessions: ', sessions);
});

// use this helper function to save session related data to db
// var saveSessionModel = (data, callback) => {
//   session.save().then((result) => {
//     callback(result);
//   });
// }

// // use this helper function to save recommend-result related data to db
// var saveRecommendResult = (data, callback) => {
//   recommendResult.save().then((result) => {
//     callback(result);
//   });
// }

module.exports = {
  saveSessionModel : saveSessionModel,
  saveRecommendResult : saveRecommendResult,
  findSession : findSession,
  findRecommend : findRecommend
}