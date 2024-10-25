//handle the fetching of todo data from the db for display
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { changeComplete, getAllTasksInList, addTask, getFilteredTasks, getAllLists} = require('../db/database-actions');
const { getUserById } = require('./_helpers.js');

//Create, Read, Update, Delete
router.get('/', async (req, res) => {
  console.log("*************************");
  // console.log('req', req);
  console.log('req.body', req.query);

  const todos = await getFilteredTasks(req.query, 1000, req.session.user_id);
  const user = await getUserById(req);
  const lists = await getAllLists(req.session.user_id);

  const templateVars = {user, todos, headerText: "All To-Dos", lists};
  res.render('view-tasks', templateVars);

  return todos;
});

module.exports = router;