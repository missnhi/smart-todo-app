//This is from the todoFORM in views/partials/todo_input_form.ejs

document.getElementById("todoForm").addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault(); // Prevent the form from submitting by default

  const itemName = document.getElementById("itemName").value;
  console.log("Item Name:", itemName); // Check if the item name is being captured

  if (!itemName) {
    alert("Please enter an item.");
    return;
  }

  try {
    // Make an API call to categorize the item
    const response = await fetch('/api/todo/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemName: itemName })
    });

    const data = await response.json();
    console.log("API response:", data); // Log the API response to verify category
    // EX of data = { category : { category:"ToRead",  errors : [] } }

    if (response.ok) {
      // check if errors are present in the response
      if (data.errors && data.errors.length > 0) {
        // log the errors and display an alert to the user
        console.error("Errors from API:", data.errors);
        alert(`Error(s) occurred: ${data.errors.join(', ')}`);
      } else {
        // if no errors, update the dropdown based on the categorized result
        const categoryDropdown = document.getElementById("categoryDropdown");
        console.log("Dropdown value before:", categoryDropdown.value);
        console.log("API returned category:", data.category.category);
        categoryDropdown.value = data.category.category; // Update dropdown value
        console.log("Dropdown value after:", categoryDropdown.value);
      }
    } else {
      console.error(data.error);
      alert("Error categorizing item.");
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}
