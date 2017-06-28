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
let radius = 5000;
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
  console.log('rep.body.addresses', req.body.addresses)
  let addresses = req.body.addresses;
  //for each local address
  addresses.forEach(address => {
    //format address for GET request
    address = address.split(' ').join('+');
    let geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleAPIkey}`;
    //GET request to Google Geocoding API
    rp(geocodingUrl)
    //push response into global addresses array
    .then(geocodedObject => {
      geocodedAddresses.push([(JSON.parse(geocodedObject).results[0].geometry.location.lat),
        (JSON.parse(geocodedObject).results[0].geometry.location.lng)]); //fix floating point
    })
    .then(() => {
      //for each global address
      console.log('supposed to be lat', geocodedAddresses)
        //add lat to local latSum
      console.log('*******lat', geocodedAddresses[geocodedAddresses.length-1][0])
      console.log('*******lng', geocodedAddress[geocodedAddresses.length-1][1])
      latSum += Number(geocodedAddress[geocodedAddresses.length-1][0])//.toFixed(7))*10000000;
      //add long to local longSum
      lngSum += Number(geocodedAddress[geocodedAddresses.length-1][1])//.toFixed(7))*10000000;
      console.log('latSum', latSum);
      console.log('lngSum', lngSum);
      //set global currentMidpoint = 'latSum/# of addresses,lngSum/# of addresses'
      currentMidpoint = [((latSum/addresses.length.toFixed(7))),((lngSum/addresses.length.toFixed(7)))];
      console.log('lat', currentMidpoint[0])
      nearbyRequestSuffix = `${currentMidpoint}&radius=${radius}&type=${type}&key=${googleAPIkey}`
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
        console.log('pointsOfInterest', pointsOfInterest)
      }))
      .then(() => {
        //iterate through pointsOfInterest
        pointsOfInterest.forEach(pointOfInterest => {
          //set local coords var = geometry.location.lat, geometry.location.lng
          let coords = `${geometry.location.lat},${geometry.location.lng}`
          let reverseGeocodingSearchSuffix = `${coords}&key=${googleAPIkey}`
          //GET request to REVERSE_GEOCODING_SEARCH
          rp(reverseGeocodingSearchPrefix + reverseGeocodingSearchSuffix)
          //*then* promise
          .then(() => {
            //set photos.photo_reference equal to photo url prefix + photos.photo_reference + &key=APIKEY
            let photoUrlSuffix = photos.photo_reference;
            pointOfInterest.photos.photo_reference = photoUrlPrefix + photoUrlSuffix;
          })
        })
      })
      .then(() => {
        rp('http://localhost:3000/pointsOfInterest')
        .then(() => {
          res.status(201).send();
        })
      })
    })
    //send POST response 
    .catch(err => console.log(err));
  });
  
  //front end must have promise with a get request immediately following response
});

app.get('/pointsOfInterest', (req, res) => {
  res.status(200).send(pointsOfInterest);
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

module.exports = app;