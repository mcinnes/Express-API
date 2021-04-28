const User = require("../models/User.js")

/**
  * Gets the email content and receiver information
  * @param  {object} database      The database connection to use
  * @param  {string} userId     The uuid of the user
  * @param  {string} emailType      The type of email to send
  * @return {object} || {string}
*/
const getEmailContent = (database, userId, emailType) => {

  //Email type must be be one of "welcome","confirm","forgot"
  if(!["welcome","confirm","forgot"].includes(emailType)) {
    return "Invalid type";
  }

  //Get the user using the user model
  let user = User.getUser(database, userId);

  if (user) {
    let subject;
    let message;

    switch (emailType) {
      case 'welcome':
        message = `Hello ${user.first_name} welcome to our new platform`
        subject = 'Welcome to the platform'
      break;
      case 'forgot':
        message = `Hi ${user.first_name} click here to reset your password`
        subject = 'Password Reset'
      break;
      case 'confirm':
        message = `Hey ${user.first_name} your order ${Math.random(9)} has been confirmed`
        subject = 'Order Confirmation'
      break;
    }
    return {subject,message,user};
  }
  return "invalid user";
}

/**
  * Gets one or more email records from the database 
  * @param  {object} database      The database connection to use
  * @param  {string} searchKey     The field we want to search by
  * @param  {string} searchValue      The value to search for
  * @param  {string} limit      Max number of results to return
  * @param  {string} page      The page to return
  * @param  {string} order      The key to orderby
  * @return {promise}
*/
const getEmails = (database, searchKey, searchValue, limit = 50, page = 1, order = "id:ASC") => {

  //Calculate the offset to pass to the database for pagination
  const offset = page > 1 ? limit * (page - 1) : 0;

  let orderQuery = ''

  //Fix SQL Injection
  if (order !== undefined && order.length) {
    order = order.split(':');
    orderQuery = `ORDER BY ${order[0]} ${order[1]}`
  }

  let row;
  let total;

  //Perform the correct query dependant on the searchKey that was passed. An invalid key is treated as no key
  switch (searchKey) {
    case 'email':
        row = database.prepare(`SELECT emails.uuid, title, message, emails.created_at, status, first_name, last_name, email, username, users.uuid FROM emails LEFT JOIN users on users.id = emails.user_id WHERE users.email = ? ${orderQuery} LIMIT ? OFFSET ?`).all(searchValue, limit, offset);
        total = database.prepare('SELECT count(*) as total FROM emails LEFT JOIN users on users.id = emails.user_id WHERE users.email = ?').get(searchValue)
      break;
    case 'type':
        row = database.prepare(`SELECT emails.uuid, title, message, emails.created_at, status, first_name, last_name, email, username, users.uuid FROM emails LEFT JOIN users on users.id = emails.user_id WHERE type = ? ${orderQuery} LIMIT ? OFFSET ?`).all(searchValue, limit, offset);
        total = database.prepare('SELECT count(*) as total FROM emails WHERE type = ?').get(searchValue)
      break;
    case 'date':
        row = database.prepare(`SELECT emails.uuid, title, message, emails.created_at, status, first_name, last_name, email, username, users.uuid FROM emails LEFT JOIN users on users.id = emails.user_id WHERE created_at LIKE ?% ${orderQuery} LIMIT ? OFFSET ?`).all(searchValue, limit, offset);
        total = database.prepare('SELECT count(*) as total FROM emails WHERE created_at LIKE ?%').get(searchValue)
      break;
    case 'user':
        row = database.prepare(`SELECT emails.uuid, title, message, emails.created_at, status, first_name, last_name, email, username, users.uuid FROM emails LEFT JOIN users on users.id = emails.user_id WHERE users.uuid = ? ${orderQuery} LIMIT ? OFFSET ?`).all(searchValue, limit, offset);
        total = database.prepare('SELECT count(*) as total FROM emails LEFT JOIN users on users.id = emails.user_id WHERE users.uuid = ?').get(searchValue)
      break;
    default:
      row = database.prepare(`SELECT * FROM emails ${orderQuery} LIMIT ? OFFSET ?`).all( limit, offset);
      total = database.prepare('SELECT count(*) as total FROM emails').get()
  }

  //Create our meta object to hold pagination data
  total =  total === undefined ? 0 : total.total;
  let pages = total > 0 ? Math.ceil((total/limit)) : 1;

  return {'result':row, 'meta':{'total':total, 'pages':pages}}
}

const logEmail = (database, emailType, content, status) => {
  return database.prepare('INSERT INTO emails (type, title, message, user_id, status) VALUES (?, ?, ?, ?, ?)')
                 .run(emailType, content.subject, content.message, content.user.id, status);
};

module.exports = {
  getEmailContent,
  getEmails,
  logEmail
}
