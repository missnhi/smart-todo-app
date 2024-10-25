const db = require('../connection');

const getTaskByNameQuery = async (itemName) => {
  const data = await db.query('SELECT * FROM tasks where name = $1;', [itemName]);
  return data.rows;
};

module.exports = { getTaskByNameQuery };
