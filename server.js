// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const {sessionMiddleware} = require('./middleware/cookie-middleware');
const express = require('express');
const morgan = require('morgan');
const { getUserById } = require('./routes/_helpers.js');
const { getFilteredTasks, getAllLists } = require('./db/database-actions.js');

const PORT = process.env.SERVER_PORT || 8080;
const app = express();

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users.js');
const authRoutes = require('./routes/authentication.js');
const todoApiRoutes = require('./routes/todo-api.js');
const todoRoutes = require('./routes/todos.js');
const listRoutes = require('./routes/lists.js');
app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(sessionMiddleware);


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
// app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/api', todoApiRoutes);
app.use('/todos', todoRoutes);
app.use('/lists', listRoutes);

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', async(req, res) => {
  console.log("Route '/' hit");

  const todos = await getFilteredTasks({'sort-by': 'newest-first','in-progress-only': 'in-progress-only'}, 4, req.session.user_id);
  const lists = await getAllLists(req.session.user_id);
  console.log('lists are:', lists);
  const user = await getUserById(req);
  const templateVars = {user, todos, lists};
  res.render('index', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
