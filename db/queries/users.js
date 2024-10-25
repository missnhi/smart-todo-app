const db = require('../connection');

const getUsers = async () => {
  return db.query(`SELECT * FROM users;`)
    .then(data => {
      return data.rows;
    });
};

const getUserByIdQuery = async (id) => {
  console.log("In queries/user.js", id);
  return db.query('SELECT * FROM users where id = $1;', [id])
    .then(data => {
      return data.rows[0];
    });
};

module.exports = { getUsers, getUserByIdQuery };
