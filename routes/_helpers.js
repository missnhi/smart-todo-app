// _helpers.js
const { getUsers, getUserByIdQuery } = require('../db/queries/users.js');

// Function to generate a random string
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

// Function to get a user by ID from the request session
const getUserById = async (req) => {
  const userId = req.session.user_id;
  console.log("Session user_id:", userId);

  const user = await getUserByIdQuery(userId);

  console.log("in _helpers.js, getUsersByIdQuery() = ",user);
  return user;
};

module.exports = { generateRandomString, getUserById, getUsers };
