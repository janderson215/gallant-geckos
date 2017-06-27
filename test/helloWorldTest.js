var request = require('request');
var expect = require('chai').expect;

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