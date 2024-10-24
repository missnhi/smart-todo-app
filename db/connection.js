// PG database client/connection setup
const { Pool } = require('pg');
require('dotenv').config();

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

const db = new Pool(dbParams);

db.connect()
  .then(() => {
    console.log('Connected to the database:', dbParams.database);
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

module.exports = db;
