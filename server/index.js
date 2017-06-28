const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const rp = require('request-promise-native');
const googleAPIkey = require('../keys.js').googleAPIkey;

const app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(express.static(__dirname + '/../react-client/dist'));

app.get('/', function(req, res) {
  res.status(200).send('Hello World');
});

let addresses = [];
let geocodedAddresses = [];
let currentMidpoint;
let pointsOfInterest;
let address;
let coords;
let latSum = 0;
let lngSum = 0;

const nearbyRequestPrefix = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=`
let nearbyRequestSuffix;
const iframePrefix = `<iframe src="//www.google.com/maps/embed/v1/place?q=`
const photoUrlPrefix = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=`;

app.post('/addresses', (req, res) => {
  let type = req.body.activity;
  let addresses = req.body.locations;
  new Promise((resolve, reject) => {
    addresses.forEach(address => {
      address = address.split(' ').join('+');
      let geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleAPIkey}`;
      rp(geocodingUrl)
      .then(geocodedObject => {
        geocodedAddresses.push([(JSON.parse(geocodedObject).results[0].geometry.location.lat),
          (JSON.parse(geocodedObject).results[0].geometry.location.lng)]);
          if (geocodedAddresses.length === addresses.length) {
            resolve();
          }
      });
    });
  })
  .then(() => {
    geocodedAddresses.forEach(geocodedAddress => {
      latSum += Number(geocodedAddress[0]);
      lngSum += Number(geocodedAddress[1]);
    });
    currentMidpoint = [(latSum/addresses.length).toFixed(7),(lngSum/addresses.length.toFixed(7))];
    nearbyRequestSuffix = `${currentMidpoint}&rankby=distance&type=${type}&key=${googleAPIkey}`
  })
  .then(() => {
    let nearbySearch = nearbyRequestPrefix.concat(nearbyRequestSuffix);
    rp(nearbySearch)
    .then(responseObject => {
      pointsOfInterest = JSON.parse(responseObject).results;
      pointsOfInterest.forEach(pointOfInterest => {
        let address = pointOfInterest.vicinity.split(' ').join('%20'); //url encoding
        pointOfInterest.iframe = `<iframe src="//www.google.com/maps/embed/v1/place?q=${address}&zoom=17&key=${googleAPIkey}"></iframe>`
      });
    })
    .then(() => {
      rp('http://localhost:3000/pointsOfInterest')
      .then(() => {
        res.status(201).send();
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  });
});


app.get('/pointsOfInterest', (req, res) => {
  console.log(pointsOfInterest);
  res.status(200).send(pointsOfInterest);
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

module.exports = app;