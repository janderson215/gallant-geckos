const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const rp = require('request-promise-native');
const googleAPIkey = require('../keys') || require('src/key.js').googleAPIkey || process.env.googleAPIkey;
const db = require('../db/db-helpers');

const app = express();

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(express.static(__dirname + '/../react-client/dist'));

const nearbySearchUrlPrefix = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=';
const iframePrefix = '<iframe src="https://www.google.com/maps/embed/v1/place?q=';

let addresses = [];
let geocodedAddresses = [];
let phoneNums = [];
let currentMidpoint;
let pointsOfInterest = [];
let session;
let type;
let address;
let coords;
let radius;
let latSum = 0;
let lngSum = 0;
let nearbySearchUrlSuffix;

app.post('/addresses', (req, res) => {
  type = req.body.type;
  let people = req.body.people;
  let initiatorName = req.body.initiatorName;
  let sessionType = 'meet with others';
  
  let geocodeAddresses = new Promise((resolve, reject) => {
    console.log(googleAPIkey)
    people.forEach(person => {
      phoneNums.push(person.phone);
      address = person.address.split(' ').join('+');
      let geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleAPIkey}`;
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
    nearbySearchUrlSuffix = `${currentMidpoint}&rankby=distance&type=${type}&key=${googleAPIkey}`;
  })
  .then(() => {
    const nearbySearch = new Promise((resolve, reject) => {
      let nearbySearchUrl = nearbySearchUrlPrefix.concat(nearbySearchUrlSuffix);
      rp(nearbySearchUrl)
      .then(responseObject => {
        responseObject = JSON.parse(responseObject);
        if(responseObject.status === 'OK') {
          console.log('pointsOfInterest set on 1st attempt');
          resolve(responseObject.results);
        } else if(responseObject.status === 'ZERO_RESULTS') {
          radius = 10000;
          nearbySearchUrlSuffix = `${currentMidpoint}&radius={radius}&type=${type}&key=${googleAPIkey}`
          nearbySearchUrl = nearbySearchUrlPrefix.concat(nearbySearchUrlSuffix);
          console.log('attempt 2 query string', nearbySearchUrl);
          rp(nearbySearchUrl)
          .then(responseObject2 => {
            responseObject2 = JSON.parse(responseObject2);
            if(responseObject2.status === 'OK') {
              console.log('pointsOfInterest set on 2nd attempt');
              resolve(responseObject2.results);
            } else if (responseObject2.status === 'ZERO_RESULTS') {
              radius = 50000;
              nearbySearchUrlSuffix = `${currentMidpoint}&radius={radius}&type=${type}&key=${googleAPIkey}`
              nearbySearchUrl = nearbySearchUrlPrefix.concat(nearbySearchUrlSuffix);
              rp(nearbySearchUrl)
              .then(responseObject3 => {
                responseObject3 = JSON.parse(responseObject3);
                if(responseObject3.status === 'OK') {
                  console.log('pointsOfInterest set on 3rd attempt');
                  resolve(responseObject3.results);
                } else {
                  console.log('Error on Attempt 3');
                }
              })
              .catch(err => console.log('Caught error on Attempt 3:', err))
            } else {
              console.log('Error on Attempt 2')
            }
          })
          .catch(err => console.log('Caught error on Attempt 2: ', err))
        } else {
          console.log('Error on Attempt 1');
        }
      })
      .catch(err => console.log('Nearby Search API error: ', err));
    });

    nearbySearch.then(nearbySearchResults => {
      //save to db here
      pointsOfInterest = nearbySearchResults;

      pointsOfInterest.forEach(pointOfInterest => {
        pointOfInterest.address = pointOfInterest.vicinity;
        pointOfInterest.iframe_string = `${iframePrefix.concat(address)}&zoom=17&key=${googleAPIkey}"></iframe>`;
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
        res.status(201).send('Object id', session._id);
      })
      .catch(err => res.status(500).send());
    })
    .catch(err => console.log(err));
  });
});

//Pulling from the DB
app.get('/pointsOfInterest', (req, res) => {
  console.log(pointsOfInterest);
  initiatorName: req.body.
  //find from db
  //
  res.status(200).send(pointsOfInterest);
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port " + this.address().port);
});

module.exports = app;
