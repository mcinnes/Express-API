module.exports = function(app){
  var bodyParser = require('body-parser')

  app.get('/emails', (req, res) => {
    let emails = EmailController.getEmails(database, query.searchKey, query.searchValue, query.limit, query.page, query.order);

    if (emails) {
      res.status(200).send(respond("success", "", emails));
    }
  })

  app.put("/email", bodyParser.json(), (req, res) => { 
    let content = EmailController.getEmailContent(database,req.body.user, req.body.type)

    Mailer.sendEmail(mailgunConnection, content.user, content.subject, content.message).then((result) => {
        EmailController.logEmail(database, req.body.type, content, 1);
        res.status(200).send(respond("success", "", result));
    }).catch((error) => {
        EmailController.logEmail(database, req.params.type, content, 0);
        res.status(500).send(respond("fail", "Unable to send email", error));
    });
  });
}
