SELECT tasks.*, task_lists.name
FROM tasks
LEFT JOIN task_lists ON tasks.list_id = task_lists.id
WHERE tasks.user_id = 1
AND task_lists.name = 'To Watch'
GROUP BY tasks.id, tasks.user_id, tasks.name, tasks.complete, task_lists.name
ORDER BY tasks.complete
LIMIT 5;