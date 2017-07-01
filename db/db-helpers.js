const mongoose = require('mongoose');
const Session = require('./index').session;
// const Location = require('./index').location;
// const Attendee = require('./index').attendee;
const Recommendation = require('./index').recommendation;

// const sampleData = require('../sampleOutputObject.js');
// const pointsOfInterest = sampleData.pointsOfInterest;
// const phoneNums = sampleData.phoneNums;

// console.log(sampleData[0].name)
// console.log('sampleOutputObject.js: ', sampleData)
// var data = sampleData[0];

mongoose.connect('mongodb://localhost/sessions');
var db = mongoose.connection;
// db.dropDatabase();


// API returns an array of object
// pass in object into Recommendation model to create instance of recommendResult data
// let recommendResult = new Recommendation({
//   name: pointsOfInterest.name,
//   address: pointsOfInterest.vicinity,
//   iframe_string: pointsOfInterest.iframe,
//   photo_url: pointsOfInterest.photo
// });

// let saveRecommendResult = recommendResult.save(function(err) {
//   if (err) { return console.error('Error: ', err); }
//   console.log('sessionTest saved');
// });
// // use this helper function to save recommend-result related data to db
// var saveRecommendResult = ((data, callback) => {
//   recommendResult.save().then((result) => {
//     callback(result);
//   });
// });

// API returns an array of object
// pass in object into Session model to create instance of session data
// let session = new Session(sessionObject);

// let saveSessionModel = session.save(function(err) {
//   if (err) { return console.error('Error: ', err); }
//   console.log('sessionTest saved');
// });
// use this helper function to save session related data to db
let saveSessionModel = (data => {
  let session = new Session(data);
  return session.save()
})
.catch(err => console.log('Error saving Session: ', err));


let findSession = Session.findById(id).exec();

findSession
.catch(err => console.log('Error finding Session: ', err));

// let findRecommend = Recommendation.find({}, function(err, recommends) {
//   if (err) { return console.error('Error: ', err); }
//   pointsOfInterest = recommends;
//   console.log('sessions: ', sessions);
// });



module.exports = {
  saveSessionModel : saveSessionModel,
  // saveRecommendResult : saveRecommendResult,
  findSession : findSession//,
  // findRecommend : findRecommend
}