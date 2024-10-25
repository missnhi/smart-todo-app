//handle the fetching of todo data from the db for display
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { changeComplete, getAllTasksInList, addTask, getFilteredTasks} = require('../db/database-actions');
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
router.get('/new', async(req, res) => {
  const user = await getUserById(req);
  const newTodo = await addTask();
  
  const templateVars = {user, headerText: "Create a To-Do"};
  res.render('create-todo', templateVars);
});

router.post('/new', async(req, res) => {
  console.log(req.body);
  const newTodo = await addTask(req.session.user_id, undefined, req.body.task-name, req.body.due-date, req.body.description);
  
});

//READ
router.get('/:id', async(req, res) => {
  //req params must match the name of the list
  const todos = await getAllTasksInList({}, req.params.id, 100, req.session.user_id);
  const user = await getUserById(req);
  console.log("in server.js, user =",user);

  const templateVars = {user, todos, headerText: req.params.id};
  res.render('view-tasks', templateVars);
});

//UPDATE
//filter the tasks in a given list
router.post('/:id/filtered', async(req, res) => {
  const todos = await getAllTasksInList(req.body, req.params.id, 1000, req.session.user_id);
  res.json({data: todos})

  return res.status(200);
});

//filter all tasks by the query params
router.post('/filtered', async (req, res) => {
  const todos = await getFilteredTasks(req.body, 1000, req.session.user_id);
  res.json({data: todos})

  return res.status(200);
});

//Mark a task as complete from client side and update db
router.post('/mark-complete', async (req, res) => {
  const updateRow = await changeComplete(req.session.user_id, req.body.taskID);

  return res.status(200);
});

//DELETE
router.post('/:id/delete', async(req, res) => {
  
});
module.exports = router;