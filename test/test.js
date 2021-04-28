var assert = require('assert');
var expect = require('chai').expect
var request = require('request');

describe('API', function (){
  describe("UserAPI", function() {

    var url = "http://localhost:3000/users/";

    it("returns status 200", function() {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      });
    });

    it("response should be an object", function() {
      request(url, function(error, response, body) {
        expect(body).to.be.a("string");
      });
    });

    it("response should contain status", function() {
      request(url, function(error, response, body) {
        body = JSON.parse(body)
        expect(body).to.have.property("status");
      });
    });

    it("response should contain message", function() {
      request(url, function(error, response, body) {
        body = JSON.parse(body)
        expect(body).to.have.property("message");
      });
    });

    it("response should contain data", function() {
      request(url, function(error, response, body) {
        body = JSON.parse(body)
        expect(body).to.have.property("data");
      });
    });

    it("response data.result should contain information", function() {
      request(url, function(error, response, body) {
        body = JSON.parse(body)
        expect(body.data.result).be.an("array");
      });
    });

    it("returns status 404", function() {
      request(url+"-1", function(error, response, body) {
        expect(response.statusCode).to.equal(404);
      });
    });
  });
  describe("EmailAPI", function() {

    var url = "http://localhost:3000/emails/";

    it("returns status 200", function() {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      });
    });

    it("response should be an object", function() {
      request(url, function(error, response, body) {
        expect(body).to.be.a("string");
      });
    });

    it("response should contain status", function() {
      request(url, function(error, response, body) {
        body = JSON.parse(body)
        expect(body).to.have.property("status");
      });
    });

    it("response should contain message", function() {
      request(url, function(error, response, body) {
        body = JSON.parse(body)
        expect(body).to.have.property("message");
      });
    });

    it("response should contain data", function() {
      request(url, function(error, response, body) {
        body = JSON.parse(body)
        expect(body).to.have.property("data");
      });
    });

    it("response data.result should contain information", function() {
      request(url, function(error, response, body) {
        body = JSON.parse(body)
        expect(body.data.result).be.an("array");
      });
    });

    it("returns status 404", function() {
      request(url+"-1", function(error, response, body) {
        expect(response.statusCode).to.equal(404);
      });
    });
  });

});

describe('Database', function () {
  require('dotenv').config()
  const database = require('better-sqlite3')('./database/'+process.env.DB_HOST, {  });
  const EmailController = require("../controllers/EmailController.js")

  it("logs email and returns an object", function() {
    let logEmail = EmailController.logEmail(database, 'test', {"subject":"test","message":"test","user":{"id":1},"status":3}) 
    expect(logEmail).to.be.a("object");
  });
  
});
