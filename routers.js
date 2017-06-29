//i: array of street addresses
//o: array of place objects
//s: mutates the session addresses
//c: within the radius of the geographical mean
const request = require('request');
const rp = require('request-promise-native');
const googleAPIkey = require('../keys.js').googleAPIkey;
const express = require('express');
const app = express();

const data = { 
  addresses: [
    '11500 nw 14th ct, pembroke pines, fl, 33026', 
    '11911 NW 16th st, pembroke pines, fl, 33026', 
    'n11w31868 phyllis pkwy, delafield, wi, 53018', 
    '12305 birchfalls dr, raleigh, nc, 27614', 
    '347 chestnut st, san francisco, ca, 94133'
  ]
};

let addresses = [];
let currentMidpoint;
let radius = 500;
let type = 'restaurant';
let pointsOfInterest;
let address;
let coords;

const nearbyRequestPrefix = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=`
let nearbyRequestSuffix;
const reverseGeocodingSearchPrefix = `https://maps.googleapis.com/maps/api/geocode/json?latlng=`
const iframePrefix = `<iframe src="//www.google.com/maps/embed/v1/place?q=`//${address}&zoom=17&key=${googleAPIkey}"></iframe>`;
    //address must be formatted as 'Harrods,Brompton%20Rd,%20UK'
const photoUrlPrefix = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=`;
// app.use(express.static + (__dirname + '/path')); //replace path with actual static files being served

//accept POST request with array of addresses, radius (max 50,000m) and type of place

app.post('/addresses', data, (req, res) => {
  //declare local latSum
  let latSum = 0;
  //declare local lngSum
  let lngSum = 0;
  //for each local address
  data.addresses.forEach(address => {
    //format address for GET request
    address = address.split(' ').join('+');
    let geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleAPIkey}`;
    //GET request to Google Geocoding API
    // console.log(geocoding_url);
    rp(geocodingUrl)
    //push response into global addresses array
    .then(geocodedObject => {
      addresses.push(JSON.parse(geocodedObject).results[0].geometry.location);
    })
    .then(() => {
      //for each global address
      addresses.forEach(address => {
        //add lat to local latSum
        latSum += address[0];
        //add long to local longSum
        lngSum += address[1];
      });
      //set global currentMidpoint = 'latSum/# of addresses,lngSum/# of addresses'
      currentMidpoint = `${latSum/addresses.length},${lngSum/addresses.length}`;
      let nearbyRequestSuffix = `${currentMidpoint}&radius=${radius}&type=${type}&key=${googleAPIkey}`
    })
    //GET request to Google Places API passing LatLng, radius and type of place
    .then(() => {
      rp(nearbyRequestPrefix + nearbyRequestPrefix);
    })
    .then((responseObject => {
      //set global pointsOfInterest to results array returned from Google Places call
      pointsOfInterest = JSON.parse(responseObject).results;
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
      res.status(201).send();
    })
    //send POST response 
    .catch(err => console.log(err));
  });
  
  //front end must have promise with a get request immediately following response
});

app.get('/pointsOfInterest', (req, res) => {
  res.status(200).send(pointsOfInterest);
});

// var testing = () => {
//   data.addresses.forEach(address => {
//     //format address for GET request
//     address = address.split(' ').join('+');
//     let geocoding_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleAPIkey}`;
//     //GET request to Google Geocoding API
//     // console.log(geocoding_url);
//     rp(geocoding_url)
//     //push response into global addresses array
//     .then(geocoded_object => {
//       addresses.push(JSON.parse(geocoded_object).results[0].geometry.location);
//     })
//     //for each global address
//     //add lat to local latSum
//     //add long to local longSum
//   //set global currentMidpoint equal to 
//     //string of latSum divided by # of addresses, longSum divided by # of addresses
//     .catch(err => console.log(err));
//   });
// };