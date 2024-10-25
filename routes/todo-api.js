// this will be mounted to /api route in server.js

const express = require('express');
const {categorizeItem} = require("../util/categorizeItemApi");
const {getUserById, itemAlreadyExist, getTaskID} = require("./_helpers");
const router = express.Router();
const db = require('../db/connection');


// Route for adding a new to-do item
router.post('/todo/categorize', async(req, res) => {
  const itemName = req.body.itemName; //from todo_input_form.ejs
  if (!itemName) {
    return res.status(400).json({error: 'Item name is required'});
  }

  if (await itemAlreadyExist(itemName)) {
    //return error 409 (Conflict)
    return res.status(409).json({error: 'Item_Already_Exists'});
  }

  try {
    // console.log(itemName); //error checking
    const result = await categorizeItem(itemName);

    // console.log("Category object: ", result);
    console.log("in todo-api.js, Category: ", result.category);
    console.log("in todo-api.js, displayInformation: ", result.displayInformation);
    // will change with actual database logic)
    const user = await getUserById(req);

    console.log("in todo-api.js, user =",user);

    // Insert the new task into the database, table tasks
    let list_id;
    if (result.category === "ToWatch") {
      list_id = 1;
    } else if (result.category === "ToRead") {
      list_id = 2;
    } else if (result.category === "ToBuy") {
      list_id = 3;
    } else if (result.category === "ToEat") {
      list_id = 4;
    } else { // uncatergorized
      list_id = null;
    }
    console.log("List ID: ",list_id);

    const descriptionObject = result.displayInformation;
    const descriptionJSON = JSON.stringify(descriptionObject);
    const query = `\
    INSERT INTO tasks (user_id, list_id, name, description)
  VALUES ($1, $2, $3, $4)
    RETURNING id;
`;
    const values = [user.id, list_id, itemName, descriptionJSON];

    // const descriptionObjectparse = JSON.parse(descriptionJSON);

    try {
      await db.query(query, values);
      console.log("Successfully insert the new task:");
    } catch (err) {
      console.error('Error inserting new task:', err);
      res.status(500).send('Internal Server Error');
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Error categorizing item:', error);
    return res.status(500).json({ error: 'Failed to categorize item' });
  }

});
/*
************************************************
* 2 routes for user to manually overriding the category of a to-do item
 */
// Route to get the item ID based on the item name
router.get('/todo/item-id', async (req, res) => {
  const itemName = req.query.itemName;
  console.log(`router.get('/todo/item-id) ItemName = '${itemName}'` );

  try {
    //call the query to get the task ID from the backend.
    const itemId = await getTaskID(itemName);
    console.log(`itemId = await getTaskID(itemName)= '${itemId}'` );

    if (!itemId) {
      return res.status(404).json({ error: 'route todo/item-id: Item not found' });
    }

    return res.status(200).json({ itemId: itemId });
  } catch (error) {
    console.error('Error fetching item ID:', error);
    return res.status(500).json({ error: 'route todo/item-id: Failed to fetch item ID' });
  }
});
//Route to update the category "list_id" of a specific task
router.put('/todo/:id/category', async (req, res) => {
  const newCategory = req.body.newCategory;
  console.log("New Category: ", newCategory);

  const itemId = req.params.id;
  console.log("the Id of the item: ", itemId);

  if (!newCategory) {
    return res.status(400).json({ error: 'New category is required' });
  }

  try {
    // Retrieve the new list_id based on the new category
    let new_list_id;
    if (newCategory === "ToWatch") {
      new_list_id = 1;
    } else if (newCategory === "ToRead") {
      new_list_id = 2;
    } else if (newCategory === "ToBuy") {
      new_list_id = 3;
    } else if (newCategory === "ToEat") {
      new_list_id = 4;
    } else {
      new_list_id = null;
    }

    // Update the category in the database
    const query = `\
      UPDATE tasks
      SET list_id = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [new_list_id, itemId];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.status(200).json({ message: 'Category updated', todo: result.rows[0] });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ error: 'Failed to update category' });
  }
});

module.exports = router;
