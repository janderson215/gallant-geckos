const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const rp = require('request-promise-native');
let googleAPIkey = require('../keys.js').googleAPIkey || process.env.googleAPIkey;

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
let pointsOfInterest;
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
  
  let geocodeAddresses = new Promise((resolve, reject) => {
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
      });
    });
  });

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
    console.log('phones', phoneNums);
    console.log('nearbySearch string', nearbySearch)
    rp(nearbySearch)
    .then(responseObject => {
      responseObject = JSON.parse(responseObject);
      if(responseObject.status === 'OK') {
        pointsOfInterest = responseObject.results;
      } else if(responseObject.status === 'ZERO_RESULTS') {
        radius = 10000;
        nearbyRequestSuffix = `${currentMidpoint}&radius={radius}&type=${type}&key=${googleAPIkey}`
        console.log('attempt 2 query string', nearbySearch);
        rp(nearbySearch)
        .then(responseObject2 => {
          responseObject2 = JSON.parse(responseObject2);
          if(responseObject2.status === 'OK') {
            pointsOfInterest = responseObject.results;
          } else if(responseObject2.status === 'ZERO_RESULTS') {
            radius = 50000;
            nearbyRequestSuffix = `${currentMidpoint}&radius={radius}&type=${type}&key=${googleAPIkey}`
            rp(nearbySearch)
            .then(responseObject3 => {
              responseObject3 = JSON.parse(responseObject3);
              if(responseObject3.status === 'OK') {
                pointsOfInterest = responseObject.results;
              } else {
                console.log('Error on Attempt 3')
              }
            })
          } else {
            console.log('Error on Attempt 2')
          }
        })
      } else {
        console.log('Error that is not ZERO_RESULTS on Attempt 1');
      }

      console.log('just before POI for', pointsOfInterest);
      pointsOfInterest.forEach(pointOfInterest => {
        let address = pointOfInterest.vicinity.split(' ').join('%20'); //url encoding
        pointOfInterest.iframe = `${iframePrefix.concat(address)}&zoom=17&key=${googleAPIkey}"></iframe>`
      });
    })
    .then(() => {
      res.status(201).send()//(pointsOfInterest);
    });
  })
  .then(() => {
    // rp('http://localhost:3000/pointsOfInterest')
    // .then(() => {
      //save to db here
      //res.write('points of interest');
    // })
    // .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
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