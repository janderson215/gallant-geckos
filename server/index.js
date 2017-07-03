const bodyParser = require('body-parser');
const express = require('express');
const parseUrl = require('url-parse');
const request = require('request');
const rp = require('request-promise-native');
const db = require('../db/db-helpers');
let GOOGLEKEY;

if (process.env.GOOGLEKEY) {
  console.log('Using ENV keys')
  GOOGLEKEY = process.env.GOOGLEKEY;
} /* else {
  console.log('Using local keys')
  GOOGLEKEY = require('../keys').GOOGLEKEY;
} // */ //uncomment for local

const app = express();

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(express.static(__dirname + '/../react-client/dist'));

const nearbySearchUrlPrefix = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=';
const iframePrefix = '<iframe src="https://www.google.com/maps/embed/v1/place?q=';
const photoUrlPrefix = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=`;

let addresses = [];
let geocodedAddresses = [];
let phoneNums = [];
let currentMidpoint;
let pointsOfInterest = [];
let session;
let type;
let address;
let coords;
let radius = 10000;
let latSum = 0;
let lngSum = 0;
let nearbySearchUrlSuffix;
let photoUrlSuffix;

//Convert addresses input by user to magical object and save to db
  //returns the objectID in the POST response for future queries
app.post('/addresses', (req, res) => {
  type = req.body.type;
  let people = req.body.people;
  let initiatorName = req.body.initiatorName;
  let sessionType = 'meet with others';
  
  let geocodeAddresses = new Promise((resolve, reject) => {
    people.forEach(person => {
      phoneNums.push(person.phone);
      address = person.address.split(' ').join('+');
      let geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLEKEY}`;
      rp(geocodingUrl)
      .then(geocodedObject => {
        geocodedAddresses.push([(JSON.parse(geocodedObject).results[0].geometry.location.lat),
          (JSON.parse(geocodedObject).results[0].geometry.location.lng)]);
        if (geocodedAddresses.length === people.length) {
          resolve(geocodedAddresses);
        }
      })
      .catch(err => console.log('Error geocoding addresses: ', err));
    });
  });

  geocodeAddresses.then(geocodedAddresses => {
    geocodedAddresses.forEach(geocodedAddress => {
      latSum += Number(geocodedAddress[0]);
      lngSum += Number(geocodedAddress[1]);
    });
    currentMidpoint = [(latSum/geocodedAddresses.length).toFixed(7),(lngSum/geocodedAddresses.length).toFixed(7)];
    nearbySearchUrlSuffix = `${currentMidpoint}&rankby=distance&type=${type}&key=${GOOGLEKEY}`;
  })
  .then(() => {
    let searchByRadius = false;

    const nearbySearch = new Promise((resolve, reject) => {
      let attemptCounter = 1
      let nearbySearchUrl;

      const nearbySearchAPICall = () => {
        nearbySearchUrlSuffix = searchByRadius ? `${currentMidpoint}&radius=${radius}&type=${type}&key=${GOOGLEKEY}` : nearbySearchUrlSuffix;
        nearbySearchUrl = nearbySearchUrlPrefix.concat(nearbySearchUrlSuffix);
        rp(nearbySearchUrl)
        .then(responseObject => {
          responseObject = JSON.parse(responseObject);
          if (responseObject.status === 'OK') {
            console.log(`pointsOfInterest set on attempt ${attemptCounter}`);
            resolve(responseObject.results);
          } else if (responseObject.status === 'ZERO_RESULTS') {
            radius = radius ? radius * 2 : 1000;
            attemptCounter++
            searchByRadius = true;
            console.log('No results found within ${radius/1000}km. Expanding radius…')
            nearbySearchAPICall();
          } else {
            reject(responseObject);
          }
        })
        .catch(err => console.log(err));
      }

      nearbySearchAPICall();
    })
    .catch(err => console.log(err));

    nearbySearch.then(nearbySearchResults => {
      pointsOfInterest = nearbySearchResults;

      pointsOfInterest.forEach(pointOfInterest => {
        pointOfInterest.address = pointOfInterest.vicinity;
        pointOfInterest.iframe_string = `${iframePrefix.concat(pointOfInterest.address.split(' ').join('+'))}&zoom=17&key=${GOOGLEKEY}"></iframe>`;
        if (pointOfInterest.photos) {
          photoUrlSuffix = pointOfInterest.photos[0].photo_reference;
          pointOfInterest.photo_url = photoUrlPrefix.concat(photoUrlSuffix, `&key=${GOOGLEKEY}`);
        } else {
          pointOfInterest.photo_url = pointOfInterest.icon;
        }
      });

      const sessionObject = {
        session_type: sessionType,
        initiator_name: initiatorName,
        location_type: type,
        phone_numbers: phoneNums,
        midpoint_coordinates: currentMidpoint.join(''),
        recommended_destinations: pointsOfInterest
      };

      const writeSession = new Promise((resolve, reject) => {
        console.log('Saving Session');
          db.saveSessionModel(sessionObject, res, result => {
          resolve(result);
        });
      });

      writeSession.then(session => {
        console.log('session', session);
      })
      .catch(err => res.status(500).send());
    })
    .catch(err => console.log(err));
  });
});

//Return the Session document returned from the db query to the client
app.get('/points-of-interest', (req, res) => {
  console.log('Pulling POIs by Session ID');

  let id = req.query.id;
  db.findSession(id, res);
});

//SMS all parties involved
app.post('/notify-parties', (req, res) => {
  let initiatorName = req.body.initiatorName;
  let location = req.body.location;
  let phoneNums = req.body.phoneNums;
  let accountSid;
  let authToken;
  if (process.env.twilioSid) {
    accountSid = process.env.twilioSid;
    authToken = process.env.twilioToken;
  } /* else {
    accountSid = require('../keys').TWILIOSID;
    authToken = require('../keys').TWILIOTOKEN;
  } // */
  const client = require('twilio')(accountSid, authToken);
  const messageBody = `${initiatorName} wants to meet you at ${location.name}. The address is ${location.address}`;

  phoneNums.forEach(phoneNum => {
    client.messages.create({
      to: phoneNum,
      from: '+19549457351',
      body: messageBody
    }, (err, message) => {
      err ? res.status(500).send(err) : res.status(201).send(message.sid)
    });
  })

});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port " + this.address().port);
});

module.exports = app;
