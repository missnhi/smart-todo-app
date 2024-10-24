// this will be mounted to /api route in server.js

const express = require('express');
const {categorizeItem} = require("../util/categorizeItemApi");
const router = express.Router();

// Route for adding a new to-do item
router.post('/todo/categorize', async(req, res) => {
  const itemName = req.body.itemName; //from todo_input_form.ejs
  if (!itemName) {
    return res.status(400).json({error: 'Item name is required'});
  }

  try {
    // console.log(itemName); //error checking
    const category = await categorizeItem(itemName);

    console.log("Category: ", category);

    // will change with actual database logic)
    const newTodo = {id: Date.now(), name: itemName, category: category};

    return res.status(200).json({ category });
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
