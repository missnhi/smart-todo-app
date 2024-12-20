const db = require("./connection");

//Change the complete value in a table
const changeComplete = function(user_id, task_id) {
  return db.query(
    `
    UPDATE tasks
    SET complete = NOT complete
    WHERE user_id = $1 AND id = $2
    RETURNING *;
    `,
    [user_id, task_id]
  )
  .then((res) => {
    console.log("updated value");
  })
  .catch(err => {
    console.log(err.message);
  })
}

//get all the tasks in a given by list name
const getAllTasksInList = (options, listName, limit = 5, userID = 1) => {
  const queryParams = [userID, listName.toLowerCase(), limit];
  let queryOrder = '';

  let queryString = `
  SELECT tasks.*
  FROM tasks
  LEFT JOIN task_lists ON tasks.list_id = task_lists.id
  WHERE TRUE
  `;

  if(options){
    if(options['sort-by']){
      switch (options['sort-by']) {
        case 'newest-first':
          queryOrder += `ORDER BY tasks.id DESC`;
        break;
        case 'oldest-first':
          queryOrder += `ORDER BY tasks.id ASC`;
        break;
        case 'AtoZ':
          queryOrder += `ORDER BY tasks.name ASC`;
        break;
        case 'ZtoA':
          queryOrder += `ORDER BY tasks.name DESC`;
        break;
        case 'completion':
          queryOrder += `ORDER BY tasks.complete`;
        break;
        case 'due-date':
          queryOrder += `ORDER BY tasks.due_date`;
        break;      
        default:
          break;
      }
    }

    if(options['completed-only'] && !options['in-progress-only']){
      queryParams.push(`true`);
      queryString += `AND tasks.complete = $${queryParams.length} `;
    }
    if(options['in-progress-only'] && !options['completed-only']){
      queryParams.push(`false`);
      queryString += `AND tasks.complete = $${queryParams.length} `;
    }
  }

  queryString += `
  AND tasks.user_id = $1
  AND LOWER(task_lists.name) = $2
  GROUP BY tasks.id, tasks.user_id, tasks.name, tasks.complete, task_lists.name
  ${queryOrder}
  LIMIT $3; 
  `;

  return db.query(queryString, queryParams).then((res) => {return res.rows}).catch(err => {console.log(err.message)});
}

//get all the tasks associated with a user
const getAllTasks = (userID = 1) => {
  let queryString = `
  SELECT *
  FROM tasks
  WHERE tasks.user_id = $1
  ORDER BY tasks.complete;
  `;

  return db.query(queryString, [userID]).then((res) => {return res.rows}).catch(err => {console.log(err.message)});
}

//get all the tasks associated with a user, filtered by options
const getFilteredTasks = (options, limit = 5, userID = 1) => {
  const queryParams = [userID, limit];
  let queryOrder = '';

  let queryString = `
  SELECT tasks.*
  FROM tasks
  LEFT JOIN task_lists ON tasks.list_id = task_lists.id
  WHERE TRUE
  `;

  if(options){
    if(options['sort-by']){
      switch (options['sort-by']) {
        case 'newest-first':
          queryOrder += `ORDER BY tasks.id DESC`;
        break;
        case 'oldest-first':
          queryOrder += `ORDER BY tasks.id ASC`;
        break;
        case 'AtoZ':
          queryOrder += `ORDER BY tasks.name ASC`;
        break;
        case 'ZtoA':
          queryOrder += `ORDER BY tasks.name DESC`;
        break;
        case 'completion':
          queryOrder += `ORDER BY tasks.complete`;
        break;
        case 'due-date':
          queryOrder += `ORDER BY tasks.due_date`;
        break;      
        default:
          break;
      }
    }

    if(options['completed-only'] && !options['in-progress-only']){
      queryParams.push(`true`);
      queryString += `AND tasks.complete = $${queryParams.length} `;
    }
    if(options['in-progress-only'] && !options['completed-only']){
      queryParams.push(`false`);
      queryString += `AND tasks.complete = $${queryParams.length} `;
    }
  }

  queryString += `
  AND tasks.user_id = $1
  GROUP BY tasks.id, tasks.user_id, tasks.name, tasks.complete, task_lists.name
  ${queryOrder}
  LIMIT $2; 
  `;

  return db.query(queryString, queryParams).then((res) => {return res.rows}).catch(err => {console.log(err.message)});
}

const getAllLists = (userID) => {
  let queryString = `
  SELECT *
  FROM task_lists
  WHERE user_id = $1
  ORDER BY name ASC;
  `;

  return db.query(queryString, [userID]).then((res) => {console.log('res.rows task_lists', res.rows); return res.rows}).catch(err => {console.log(err.message)});
}

const addTask = (user_id, list_id = null, name, due_date, description) => {
  let queryString = `
  INSERT INTO tasks (user_id, list_id, name, description, complete)
  VALUES
  (
  $1,
  $2,
  $3,
  $4,
  false
  );
  `;

  return db.query(queryString, [user_id, list_id, name, due_date, description]).then((res) => {console.log('res.rows task_lists', res.rows); return res.rows}).catch(err => {console.log(err.message)});
}

const getSingleTask = (taskID, userID) => {
  let queryString = `
  SELECT tasks.*, task_lists.name AS list_name
  FROM tasks
  LEFT JOIN task_lists ON tasks.list_id = task_lists.id
  WHERE tasks.id = $1
  AND tasks.user_id = $2
  GROUP BY tasks.id, task_lists.name;
  `;

  return db.query(queryString, [taskID, userID]).then((res) => {console.log(res.rows[0]); return res.rows[0]}).catch(err => {console.log(err.message)});
}

module.exports = {
  changeComplete,
  getAllTasksInList,
  getAllTasks,
  getFilteredTasks,
  getAllLists,
  addTask,
  getSingleTask
}