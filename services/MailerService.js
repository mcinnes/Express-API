const Mailgun = require('mailgun.js');
const formData = require('form-data');

/**
  * Sends and email using the mailgun configuration
  * @param  {Object} user      The user we are sending the email to
  * @param  {string} subject      Subject line of the email
  * @param  {string} message      Message body of the email
  * @return {Promise}
*/
const sendEmail = (user, subject, message) => {
    return new Promise((resolve, reject) => {
      //Create a new mailgun instance
      const mailgun = new Mailgun(formData);
      const connection = mailgun.client({username: 'api', key: process.env.MAILGUN_APIKEY});

      //Create the data object that mailgun needs
      const data = {
        from: process.env.MAILGUN_NAME + ' <' + process.env.MAILGUN_FROM + '>',
        to: [user.email],
        subject: subject,
        text: message
      };
      
      //Send the data and return an email result array to keep the response formats the same
      connection.messages.create(process.env.MAILGUN_DOMAIN, data)
        .then(resolve({"result":[]}))
        .catch(reject({"result":[]}));
    });
}

//Make the sendEmail function available
module.exports = {
  sendEmail
}
