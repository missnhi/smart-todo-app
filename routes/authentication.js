//This file will handdle user login, register and logout
// then it will be mount in the server.js file

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/connection');
const { generateRandomString, getUserById, getUsers } = require('./_helpers');

//error checking if this route is hit
router.get('/', async (req, res) => {
  console.log("*************************");
  return res.status(200);
});

// GET route to render the registration page
router.get('/register', async (req, res) => {
  const user = await getUserById(req);
  if (user) {
    return res.redirect('/');
  }
  const templateVars = { user };
  res.render('register', templateVars);
});

// POST route to register a new user
router.post('/register', async (req, res) => {
  const username = req.body.email;
  const email = req.body.email;
  const password = req.body.password;
  let id = generateRandomString();
  const users = await getUsers();
  console.log('/register ', users);

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

  // Insert the new user into the database
  const query = `\
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id;
`;
  const values = [username, email, hash];

  try {
    const result = await db.query(query, values);
    const newUser = result.rows[0];
    req.session.user_id = newUser.id;
    res.redirect('/');
  } catch (err) {
    console.error('Error inserting new user:', err);
    res.status(500).send('Internal Server Error');
  }
});

// GET route to render the login page if click on Login
router.get('/login', async (req, res) => {
  const user = await getUserById(req);
  if (user) {
    return res.redirect('/');
  }
  const templateVars = { user };
  res.render('login', templateVars);
});


// POST route to login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await getUsers();
  console.log("post /login: ",users);

  let user;

  for (const u of users) {
    if (u.email === email) {
      user = u;
      break;
    }
  }

  if (!user) {
    return res.status(403).send('Email not found');
  }

  const result = bcrypt.compareSync(password, user.password);
  if (result) {
    req.session.user_id = user.id;
    res.redirect('/');
  } else {
    res.status(403).send('Incorrect password');
  }
});
//
// // POST route to logout a user
router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/auth/login');
});

module.exports = router;
