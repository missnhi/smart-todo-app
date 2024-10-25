// _helpers.js
const { getUsers, getUserByIdQuery } = require('../db/queries/users.js');
const { getTaskByNameQuery } = require('../db/queries/tasks.js')

// Function to generate a random string
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

// Function to get a user by ID from the request session
const getUserById = async (req) => {
  const userId = req.session.user_id;
  console.log("In _helpers.js, Session user_id:", userId);

  const user = await getUserByIdQuery(userId);

  // console.log("in _helpers.js, getUsersByIdQuery() = ",user);
  return user;
};

//Function to check if the item is already in the database task
const itemAlreadyExist = async (itemName) => {
  const tasksList = await getTaskByNameQuery(itemName);
  // console.log("in _helpers.js Number of tasks: ", tasks); //error checking
  //return true if item already exist, false if not exist
  return tasksList.length > 0;
};

//function to return the taskID using taskName a.k.a itemName
const getTaskID = async (itemName) => {
  const tasksList = await getTaskByNameQuery(itemName);
  console.log("in _helpers.js getTaskID(itemName): ", tasksList); //error checking
  console.log("in _helpers.js tasks.id: ", tasksList.id); //error checking
  return tasksList[0].id;
};


module.exports = { generateRandomString, getUserById, getUsers, itemAlreadyExist, getTaskID};
