const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const rp = require('request-promise-native');
const googleAPIkey = require('../keys.js').googleAPIkey;

const app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
// app.use(express.static(__dirname + '/../react-client/dist'));

app.get('/', function(req, res) {
  res.status(200).send('Hello World');
});

let addresses = [];
let geocodedAddresses = [];
let currentMidpoint;
let radius = 50000;
let type = 'restaurant';
let pointsOfInterest;
let address;
let coords;
let latSum = 0;
let lngSum = 0;

const nearbyRequestPrefix = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=`
let nearbyRequestSuffix;
const reverseGeocodingSearchPrefix = `https://maps.googleapis.com/maps/api/geocode/json?latlng=`
const iframePrefix = `<iframe src="//www.google.com/maps/embed/v1/place?q=`//${address}&zoom=17&key=${googleAPIkey}"></iframe>`;
    //address must be formatted as 'Harrods,Brompton%20Rd,%20UK'
const photoUrlPrefix = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=`;
// app.use(express.static + (__dirname + '/path')); //replace path with actual static files being served

//accept POST request with array of addresses, radius (max 50,000m) and type of place

app.post('/addresses', (req, res) => {
  //set addresses equal to request body
  let addresses = req.body.addresses;
  //for each local address
  new Promise((resolve, reject) => {
    addresses.forEach(address => {
    //format address for GET request
      address = address.split(' ').join('+');
      let geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleAPIkey}`;
      //GET request to Google Geocoding API
      rp(geocodingUrl)
      //push response into global addresses array
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
    //for each global address
    console.log('supposed to be lat', geocodedAddresses)
    geocodedAddresses.forEach(geocodedAddress => {
      //add lat to local latSum
      latSum += Number(geocodedAddress[0]);
      //add long to local longSum
      lngSum += Number(geocodedAddress[1]);
    });
    console.log('latSum', latSum);
    console.log('lngSum', lngSum);
    //set global currentMidpoint = 'latSum/# of addresses,lngSum/# of addresses'
    currentMidpoint = [(latSum/addresses.length).toFixed(7),(lngSum/addresses.length.toFixed(7))];
    console.log('lat', currentMidpoint[0])
    nearbyRequestSuffix = `${currentMidpoint}&rankby=distance&type=${type}&key=${googleAPIkey}`
  })
  //GET request to Google Places API passing LatLng, radius and type of place
  .then(() => {
    let nearbySearch = nearbyRequestPrefix.concat(nearbyRequestSuffix);
    console.log('nearbySearch string', nearbySearch);
    rp(nearbySearch)
    .then((responseObject => {
      //set global pointsOfInterest to results array returned from Google Places call
      console.log('responseObject', responseObject);
      pointsOfInterest = JSON.parse(responseObject).results;
      // console.log('pointsOfInterest', pointsOfInterest)
    }))
    .then(() => {
      //iterate through pointsOfInterest
      pointsOfInterest.forEach(pointOfInterest => {
        //set local coords var = geometry.location.lat, geometry.location.lng
        let coords = `${geometry.location.lat},${geometry.location.lng}`
        let reverseGeocodingSearchSuffix = `${coords}&key=${googleAPIkey}`
        //GET request to REVERSE_GEOCODING_SEARCH
        rp(reverseGeocodingSearchPrefix.concat(reverseGeocodingSearchSuffix))
        //*then* promise
        .then((reverseGeocodedObject) => {
          //set address = results
          pointOfInterest.address = results.formatted_address;
        });
        //set photos.photo_reference equal to photo url prefix + photos.photo_reference + &key=APIKEY
        let photoUrlSuffix = photos.photo_reference;
        pointOfInterest.photos.photo_reference = photoUrlPrefix.concat(photoUrlSuffix);
      })
    })
    .then(() => {
      rp('http://localhost:3000/pointsOfInterest')
      .then(() => {
        //send POST response 
        res.status(201).send();
      })
    })
    .catch(err => console.log(err));
  });
});


app.get('/pointsOfInterest', (req, res) => {
  res.status(200).send(pointsOfInterest);
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

module.exports = app;