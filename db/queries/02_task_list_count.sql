SELECT task_lists.name AS tag, count(tasks)
FROM task_lists
JOIN tasks ON tasks.list_id = task_lists.id
GROUP BY task_lists.name;