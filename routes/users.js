/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getUsers} = require ('../db/queries/users')
router.get('/', (req, res) => {
  console.log("in the router get/");

  getUsers()
    .then(users => {
      console.log("in the router get all users", users); // Log all users
      const user = req.session.user_id ? users.find(u => u.id === req.session.user_id) : null;
      const templateVars = {
        user
      };
      res.render('index', templateVars);
    })
    .catch(err =>
    res.status(500).send("Error retrieving user"));
});

module.exports = router;
