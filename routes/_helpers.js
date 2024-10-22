// _helpers.js

const bcrypt = require('bcryptjs');
const { getUsers } = require('../db/queries/users.js');

// Function to generate a random string
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

// Function to get a user by ID from the request session
const getUserById = async (req) => {
  const userId = req.session.user_id;
  console.log("Session user_id:", userId);

  const users = await getUsers();

  console.log("in _helpers.js, users = ",users);
  return users.find(user => user.id === userId);
};

module.exports = { generateRandomString, getUserById };
