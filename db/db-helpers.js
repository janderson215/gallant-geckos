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

let saveSessionModel = ((data,res) => {
  let session = new Session(data);
  saveSession = session.save()
  saveSession.then(document => {
    console.log('Session saved');
    res.status(201).send(document._id);
    // return document;
  })
  .catch(err => console.log('Error saving session:', err))
});


let findSession = ((id, res) => {
  Session.findById(id).exec()
  .then(session => {
    // create properly formatted object from session and POI data
    // send object back in get response
  })
  .catch(err => console.log('Error finding Session: ', err));
});


module.exports = {
  saveSessionModel : saveSessionModel,
  findSession : findSession
}