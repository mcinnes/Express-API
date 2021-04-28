module.exports = function(app){
  app.get('/users', (req, res) => {
    let users = UserController.getUsers(database, query.searchKey, query.searchValue, query.limit, query.page, query.order);

    if (users) {
      res.status(200).send(respond("success", "", users));
    }
  })

  app.get('/user/:userid', (req, res) => {
    //Override the search key and value
    query.searchKey = 'user';
    query.searchValue = parseInt(req.params.userid);

    let emails = EmailController.getEmails(database, query.searchKey, query.searchValue, query.limit, query.page, query.order);

    if (emails) {
      res.status(200).send(respond("success", "", emails));
    }
  })
}
