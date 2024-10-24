// this will be mounted to /api route in server.js

const express = require('express');
const {categorizeItem} = require("../util/categorizeItemApi");
const {getUserById, itemAlreadyExist} = require("./_helpers");
const router = express.Router();
const db = require('../db/connection');


// Route for adding a new to-do item
router.post('/todo/categorize', async(req, res) => {
  const itemName = req.body.itemName; //from todo_input_form.ejs
  if (!itemName) {
    return res.status(400).json({error: 'Item name is required'});
  }

  try {
    // console.log(itemName); //error checking
    const result = await categorizeItem(itemName);

    // console.log("Category object: ", result);
    console.log("Category: ", result.category);
    console.log("displayInformation: ", result.displayInformation);


    if (itemAlreadyExist(itemName)) {
      return res.status(200).json({error: 'item Already Exist'});
    }

    // will change with actual database logic)
    const user = await getUserById(req);
    console.log("in todo-api.js, user.id =",user.id);

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

// route for overriding the category of a to-do item
router.put('/todo/:id/category', (req, res) => {
  const newCategory = req.body.newCategory;
  if (!newCategory) {
    return res.status(400).json({ error: 'New category is required' });
  }

  // Simulate updating the category of the to-do item (replace with actual database logic)
  const updatedTodo = { id: req.params.id, category: newCategory };

  return res.status(200).json({ message: 'Category updated', todo: updatedTodo });
});

module.exports = router;
