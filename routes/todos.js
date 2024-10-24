//handle the fetching of todo data from the db for display
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { changeComplete, getAllTasks} = require('../db/database-actions');
const { getUserById } = require('./_helpers.js');

//Create, Read, Update, Delete
router.get('/', async (req, res) => {
  console.log("*************************");

  const todos = await getAllTasks("To Watch", 10000, 1);
  const user = await getUserById(req);
  console.log("in server.js, user =",user);

  const templateVars = {user, todos};
  res.render('view-tasks', templateVars);

  return res.status(200);
});

//CREATE
router.post('/new', async(req, res) => {
  
});

//READ
router.get('/:id', async(req, res) => {
  console.log("req.params.id", req.params.id);
  const todos = await getAllTasks(req.params.id, 100, 1);
  const user = await getUserById(req);
  console.log("in server.js, user =",user);

  const templateVars = {user, todos};
  res.render('view-tasks', templateVars);
});

//UPDATE
router.post('/:id/update', async(req, res) => {
  
});

//DELETE
router.post('/:id/delete', async(req, res) => {
  
});
module.exports = router;