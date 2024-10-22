SELECT users.username AS user, tasks.name AS todo, task_lists.name AS tag, tasks.complete AS is_completed
FROM users 
JOIN tasks ON users.id = tasks.user_id
JOIN task_lists ON tasks.list_id = task_lists.id
WHERE users.id = 1
;