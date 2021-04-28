class User{
  constructor() {}
}

/**
  * Gets one or more users from the database 
  * @param  {object} database      The database connection to use
  * @param  {string} uuid     The uuid of the user
  * @return {object}
*/
module.exports.getUser = function (database, uuid){
    //Get the user from the database
    return database.prepare('SELECT * FROM users WHERE uuid = ?').get(uuid);
}
