
/**
  * Gets one or more users from the database 
  * @param  {Object} database      The database connection to use
  * @param  {string} searchKey     The field we want to search by
  * @param  {string} searchValue      The value to search for
  * @param  {string} limit      Max number of results to return
  * @param  {string} page      The page to return
  * @param  {string} order      The key to orderby
  * @return {Promise}
*/
const getUsers = (database, searchKey, searchValue, limit = 50, page = 1, order = 'first_name:ASC') => {

  //Calculate the offset to pass to the database for pagination
  const offset = page > 1 ? limit * (page - 1) : 0;

  let row;
  let total;

  let orderQuery = '';

  //TODO: Fix possible SQL Injection
  if (order !== undefined && order.length) {
    order = order.split(':');

    //Only search by existing fields
    if(!["id","first_name","last_name","uuid","username","email"].includes(order[0])) {
      return false;
    }
    orderQuery = `ORDER BY ${order[0]} ${order[1]}`;
  }

  //Perform the correct query dependant on the searchKey that was passed. An invalid key is treated as no key
  switch (searchKey) {
    case 'firstname':
        row = database.prepare(`SELECT uuid, first_name, last_name, email, username FROM users WHERE first_name = ? ${orderQuery} LIMIT ? OFFSET ?`).all(searchValue, limit, offset);
        total = database.prepare('SELECT count(*) as total FROM users WHERE first_name = ? ').get(searchValue);
      break;
    case 'lastname':
        row = database.prepare(`SELECT uuid, first_name, last_name, email, username FROM users WHERE last_name = ? ${orderQuery} LIMIT ? OFFSET ?`).all(searchValue, limit, offset);
        total = database.prepare('SELECT count(*) as total FROM users WHERE last_name = ? ').get(searchValue);
      break;
    case 'email':
        row = database.prepare(`SELECT uuid, first_name, last_name, email, username FROM users WHERE email = ?  ${orderQuery} LIMIT ? OFFSET ?`).all(searchValue, limit, offset);
        total = database.prepare('SELECT count(*) as total FROM users WHERE email = ? ').get(searchValue);
      break;
    default:
      row = database.prepare(`SELECT uuid, first_name, last_name, email, username FROM users ${orderQuery} LIMIT ? OFFSET ?`).all(limit, offset);
      total = database.prepare('SELECT count(*) as total FROM users').get();
  }

  //Create our meta object to hold pagination data
  total =  total === undefined ? 0 : total.total;
  let pages = total > 0 ? Math.ceil((total/limit)) : 1;

  return {'result':row, 'meta':{'total':total, 'pages':pages}};
}

module.exports = {
  getUsers
}
