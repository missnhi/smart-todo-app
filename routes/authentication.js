//This file will handdle user login, register and logout
// then it will be mount in the server.js file

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { generateRandomString, getUserById, getUsers } = require('./_helpers');

router.get('/', async (req, res) => {
  console.log("*************************");
  return res.status(200);
});

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

// POST route to login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await getUsers();
  let user;

  for (const userId in users) {
    if (users[userId].email === email) {
      user = users[userId];
      break;
    }
  }

  if (!user) {
    return res.status(403).send('Email not found');
  }

  const result = bcrypt.compareSync(password, user.password);
  if (result) {
    req.session.user_id = user.id;
    res.redirect('/index');
  } else {
    res.status(403).send('Incorrect password');
  }
});
//
// // POST route to logout a user
router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

module.exports = router;
