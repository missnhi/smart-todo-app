//handle the fetching of todo data from the db for display
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { changeComplete, getAllTasksInList, getAllTasks, getFilteredTasks} = require('../db/database-actions');
const { getUserById } = require('./_helpers.js');

//Create, Read, Update, Delete
router.get('/', async (req, res) => {
  console.log("*************************");
  // console.log('req', req);
  console.log('req.body', req.query);

  const todos = await getFilteredTasks(req.query, 1000, req.session.user_id);
  const user = await getUserById(req);
  console.log("in server.js, user =",user);

  const templateVars = {user, todos, headerText: "All To-Dos"};
  res.render('view-tasks', templateVars);

  return todos;
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
  console.log("updated", req.params.id)
});

router.post('/:id/mark-complete', async(req, res) => {
  
});

router.post('/filtered', async (req, res) => {
  const todos = await getFilteredTasks(req.body, 1000, req.session.user_id);
  res.json({data: todos})

  return res.status(200);
});

//DELETE
router.post('/:id/delete', async(req, res) => {
  
});
module.exports = router;