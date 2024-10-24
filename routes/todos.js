//handle the fetching of todo data from the db for display
const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { changeComplete, getAllTasks} = require('../db/database-actions');

router.get('/', async (req, res) => {
  console.log("*************************");
  return res.status(200);
});