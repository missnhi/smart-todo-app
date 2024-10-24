const db = require("./connection");


//Change the complete value in a table
const changeComplete = function(todo) {
  return db.query(
    `
    UPDATE tasks
    SET complete = $1
    WHERE name = $2;
    `,
    [todo.name, !todo.complete]
  )
  .then(() => {
    console.log("updated value");
  })
  .catch(err => {
    console.log(err.message);
  })
}

const getAllTasks = (listName, limit = 5, userID = 1) => {
  let queryString = `
  SELECT tasks.user_id, tasks.name, tasks.complete, task_lists.name
  FROM tasks
  LEFT JOIN task_lists ON tasks.list_id = task_lists.id
  WHERE tasks.user_id = $1
  AND task_lists.name = $2
  GROUP BY tasks.user_id, tasks.name, tasks.complete, task_lists.name
  ORDER BY tasks.complete
  LIMIT $3;
  `;

  return db.query(queryString, [userID, listName, limit]).then((res) => console.log('getAllTasks returns:', res.rows)).catch(err => {console.log(err.message)});
}

module.exports = {
  changeComplete,
  getAllTasks
}