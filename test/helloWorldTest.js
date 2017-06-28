var request = require('request');
var expect = require('chai').expect;

var data = {
  "locations": [
    "347 chestnut st, san francisco, ca, 94133",
    "132 parcplace dr miltpitas, ca 95035",
    "31690 33rd ave, san francisco, ca 94122",
    "349 11th ave, san francisco, ca 94118"
  ],
  "activity": "restaurant"
}

describe('Status and content', function() {
  describe('Main page', function() {
    it('status', function() {
      request('http://localhost:3000/', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      })
    });

    it('content', function() {
      request('http://localhost:3000/', function(error, response, body) {
        expect('main page content').to.equal('Hello World');
      });
    });
  });

  describe('About page', function() {
    it('status', function() {
      request('http://localhost:3000/about', function(error, response, body) {
        expect(response.statusCode).to.equal(404);
      });
    });
  });
});

describe('Data flows properly from POST request and outputs in correct format', () => {
  describe('POST statusCode is successful', () => {
    it('yup', () => {
      request(`http://localhost:3000/addresses&locations=${data.locations}&activity=${data.activity}`, (error, response, body) => {
        expect(response.statusCode.to.equal(201));
      });
    });
  });
  describe('Data is received in correct format', () => {
    it('res.body', () => {
      request(`http://localhost:3000/addresses&locations=${data.locations}&activity=${data.activity}`, (error, response, body) => {
        expect(response.body.should.be.a('array'));
      });
    });
  });
});


  // describe('Main page', function() {

  //   it('status', function() {
  //     request("http://localhost:3000/", function(error, response, body) {
  //       expect(response.statusCode).to.equal(200);
  //     });

  //   it('content', function() {
  //     request('http://localhost:3000/' , function(error, response, body) {
  //       expect(body).to.equal('Hello World');
  //     });
  //   });
    
  //   it('About page', function() {
  //     request('http://localhost:3000/', function(error, response, body) {
  //       expect(response.statusCode).to.equal(404);
  //     });
  //   });

  // });