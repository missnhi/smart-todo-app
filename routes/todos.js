//handle the fetching of todo data from the db for display
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { changeComplete, getAllTasksInList, getAllTasks} = require('../db/database-actions');
const { getUserById } = require('./_helpers.js');

//Create, Read, Update, Delete
router.get('/', async (req, res) => {
  console.log("*************************");

  const todos = await getAllTasks(10000, req.session.user_id);
  const user = await getUserById(req);
  console.log("in server.js, user =",user);

  const templateVars = {user, todos, headerText: "All To-Dos"};
  res.render('view-tasks', templateVars);

  return res.status(200);
});

//CREATE
router.post('/new', async(req, res) => {
  
});

//READ
router.get('/:id', async(req, res) => {
  //req params must match the name of the list
  const todos = await getAllTasksInList(req.params.id, 100, req.session.user_id);
  const user = await getUserById(req);
  console.log("in server.js, user =",user);

  const templateVars = {user, todos, headerText: req.params.id};
  res.render('view-tasks', templateVars);
});

//UPDATE
router.post('/:id/update', async(req, res) => {
  
});

router.post('/:id/mark-complete', async(req, res) => {
  
});

//DELETE
router.post('/:id/delete', async(req, res) => {
  
});
module.exports = router;