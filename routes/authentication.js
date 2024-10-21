//This file will handdle user login, register and logout
// then it will be mount in the server.js file

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { generateRandomString, getUserById } = require('../_helpers');

// GET route to render the registration page
router.get('/register', async (req, res) => {
  const user = await getUserById(req);
  if (user) {
    return res.redirect('/index');
  }
  const templateVars = { user };
  res.render('register', templateVars);
});

// POST route to register a new user
router.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let id = generateRandomString();
  const users = await getUsers();

  while (users[id]) {
    id = generateRandomString();
  }
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }
  for (const user of users) {
    if (user.email === email) {
      return res.status(400).send('Email already exists');
    }
  }
  const hash = bcrypt.hashSync(password, 10);
  users[id] = { id, email, password: hash };
  req.session.user_id = id;
  res.redirect('/index');
});

module.exports = router;
