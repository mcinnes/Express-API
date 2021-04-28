
require('dotenv').config();
const database = require('better-sqlite3')('./database/'+process.env.DB_HOST, {});
const express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const UserController = require("./controllers/UserController.js");
const Mailer = require ('./services/MailerService.js');
const EmailController = require("./controllers/EmailController.js");

const app = express();
const port = 3000;

var mailgunConnection;
var query;

/**
  * Intercept all requests and check if we need to build a search/filter query
  * @param  {Object} req      Express request object
  * @param  {Object} res      Express response object
  * @return {Function}   next
*/
app.use(function(req, res, next) {
  query = {}
  //We only need to do this if we have query parameters set
  if (req.query) {

    let limit = parseInt(req.query.limit) || 50;
    let page = parseInt(req.query.page) || 1;
    let order = req.query.order || 'id:DESC';
    let searchKey = req.query.searchkey || null;
    let searchValue = req.query.searchvalue || null;

    query = {limit, page, order, searchKey, searchValue}
  }
  next();
});

/**
  * Display documentation
  * @param  {Object} req      Express request object
  * @param  {Object} res      Express response object
  * @return {Function}   next
*/
app.get('/', (req, res) => {
  if (req.query.format == 'html') {
    //Use fs instead of sendFile as sendFile was stopping due to JS on page
    var fs = require('fs');
    fs.readFile('./static/swagger/index.html', (err, data) => {
      res.send(data.toString());
   });
  } else {
    res.sendFile('./static/swagger/swagger.json', { root: __dirname });
  }
})

/**
  * Returns a list of emails 
  * @param  {Object} req      Express request object
  * @param  {Object} res      Express response object
  * @return {Function}   next
*/
app.get('/emails', (req, res) => {
  let emails = EmailController.getEmails(database, query.searchKey, query.searchValue, query.limit, query.page, query.order);

  if (emails.result) {
    res.status(200).send(respond("success", "", emails));
  } else {
    res.status(400).send(respond("fail", "Bad Request", {"result":[]}));
  }
})

/**
  * Send an email to a user
  * @param  {Object} req      Express request object
  * @param  {Object} res      Express response object
  * @return res json
*/
app.put("/email", jsonParser, (req, res) => { 
  //Get email content based on the user and type of email we want
  let content = EmailController.getEmailContent(database,req.body.user, req.body.type);

  if (content == "invalid user") {
    res.status(400).send(respond("fail", "Invalid User", ));
  }

  if (content == "invalid type") {
    res.status(400).send(respond("fail", "Invalid Type", {}));
  }

  //Use the Mailer service to send the email
  Mailer.sendEmail(content.user, content.subject, content.message).then((result) => {
      //Log the email in the database and return a success code
      EmailController.logEmail(database, req.body.type, content, 1);
      res.status(200).send(respond("success", "Email sent", result));
  }).catch((error) => {
      //Log the failed (status 0) email in the database and return a 500
      EmailController.logEmail(database, req.body.type, content, 0);
      res.status(500).send(respond("fail", "Unable to send email", error));
  });
});

/**
  * Get list of users
  * @param  {Object} req      Express request object
  * @param  {Object} res      Express response object
  * @return res json
*/
app.get('/users', (req, res) => {
  let users = UserController.getUsers(database, query.searchKey, query.searchValue, query.limit, query.page, query.order);

  if (users.result) {
    res.status(200).send(respond("success", "", users));
  } else {
    res.status(400).send(respond("fail", "Bad Request", {"result":[]}));
  }
})

/**
  * Get list of emails for a specifed user
  * @param  {Object} req      Express request object
  * @param  {Object} res      Express response object
  * @return res json
*/
app.get('/user/:userid', (req, res) => {
  //Override the search key and value, this allows us to reuse the getEmails function
  query.searchKey = 'user';
  query.searchValue = parseInt(req.params.userid);

  let emails = EmailController.getEmails(database, query.searchKey, query.searchValue, query.limit, query.page, query.order);

  if (emails.result) {
    res.status(200).send(respond("success", "", emails));
  } else {
    res.status(400).send(respond("fail", "Bad Request", {"result":[]}));
  }
})

/**
  * Start the application
  * @param  {Number} port      The port number the applciation is to run on
  * @return void
*/
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/**
  * Define our basic response structure
  * @param  {string} status      The text status of the response (success/fail)
  * @param {string} message      Any relevant information to the response (error message/warnings etc)
  * @param {mixed} data         The response data
  * @return object
*/
const respond = (status, message, data) => {
    return {
        status,
        message,
        data
    }
}

