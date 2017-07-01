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

const nearbyRequestPrefix = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=';
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
let nearbyRequestSuffix;

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
            resolve();
          }
      })
      .catch(err => console.log('Error geocoding addresses: ',geocodingUrl, err));
    });
  });

  let mutatePlacesOfInterest = new Promise((resolve, reject) => {
    pointsOfInterest.forEach(pointOfInterest => {
      let address = pointOfInterest.vicinity.split(' ').join('%20'); //url encoding
      pointOfInterest.iframe = `${iframePrefix.concat(address)}&zoom=17&key=${googleAPIkey}"></iframe>`
    });
    console.log('POIs', pointsOfInterest)
    resolve(pointsOfInterest);
  })

  geocodeAddresses.then(() => {
    geocodedAddresses.forEach(geocodedAddress => {
      latSum += Number(geocodedAddress[0]);
      lngSum += Number(geocodedAddress[1]);
    });
    currentMidpoint = [(latSum/geocodedAddresses.length).toFixed(7),(lngSum/geocodedAddresses.length).toFixed(7)];
    nearbyRequestSuffix = `${currentMidpoint}&rankby=distance&type=${type}&key=${googleAPIkey}`;
  })
  .then(() => {
    let nearbySearch = nearbyRequestPrefix.concat(nearbyRequestSuffix);
    rp(nearbySearch)
    .then(responseObject => {
      responseObject = JSON.parse(responseObject);
      if(responseObject.status === 'OK') {
        mutatePlacesOfInterest.resolve(responseObject.results);
        console.log('pointsOfInterest set on 1st attempt');
      } else if(responseObject.status === 'ZERO_RESULTS') {
        radius = 10000;
        nearbyRequestSuffix = `${currentMidpoint}&radius={radius}&type=${type}&key=${googleAPIkey}`
        console.log('attempt 2 query string', nearbySearch);
        rp(nearbySearch)
        .then(responseObject2 => {
          responseObject2 = JSON.parse(responseObject2);
          if(responseObject2.status === 'OK') {
            resolve(responseObject2.results);
            console.log('pointsOfInterest set on 2nd attempt');
          } else if (responseObject2.status === 'ZERO_RESULTS') {
            radius = 50000;
            nearbyRequestSuffix = `${currentMidpoint}&radius={radius}&type=${type}&key=${googleAPIkey}`
            rp(nearbySearch)
            .then(responseObject3 => {
              responseObject3 = JSON.parse(responseObject3);
              if(responseObject3.status === 'OK') {
                resolve(responseObject3.results);
                console.log('pointsOfInterest set on 3rd attempt');
              } else {
                console.log('Error on Attempt 3')
              }
            })
            .catch(err => console.log('Caught error on Attempt 3:', err))
          } else {
            console.log('Error on Attempt 2')
          }
        })
        .catch(err => console.log('Caught error on Attempt 2: ', err))
      } else {
        console.log('Error that is not ZERO_RESULTS on Attempt 1');
      }
    })
    .catch(err => console.log('Nearby Search API error: ', err));
  })
  .then(() => {
    //save to db here
    // const recommendedObject = (pointOfInterest => {
    //   return {
    //     name: pointOfInterest.name,
    //     address: pointOfInterest.vicinity,
    //     iframe_string: pointOfInterest.iframe,
    //     photo_url: pointOfInterest.photos
    //   };
    // };
    const sessionObject = {
      session_type: sessionType,
      initiator_name: initiatorName,
      location_type: type,
      phone_numbers: phoneNums,
      midpoint_coordinates: currentMidpoint.join(''),
      recommended_destinations: pointsOfInterest
    };
    console.log('Rec Ds after setting equal to POIs', sessionObject.recommended_destinations)

    const writeSession = new Promise((resolve, reject) => {
      console.log('Saving Session');

    });

    db.saveSessionModel(sessionObject, result => {
      console.log('Session saved');
      resolve(result)
      // .then(() => res.status(201).send())//session._id))
    });

    writeSession;
    // .then((session) => {
    //   res.status(201).send(session._id);
    // })
    // .catch(err => res.status(500).send())
  })
  .then(() => res.status(201).send())//session._id))
});

//Pulling from the DB
// app.get('/pointsOfInterest', (req, res) => {
//   console.log(pointsOfInterest);
//   //find from db
//   res.status(200).send(pointsOfInterest);
// });

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port " + this.address().port);
});

module.exports = app;
