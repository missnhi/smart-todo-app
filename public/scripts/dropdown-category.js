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
    console.log("API response structute:", data); // Log the API response to verify category
    // EX of data = { result : { category:"ToRead",  errors : [] } }

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
        console.log("API returned category:", data.result.category);
        categoryDropdown.value = data.result.category; // Update dropdown value
        console.log("Dropdown value after:", categoryDropdown.value);
      }

      // call display additional information on the screen
      if (data.result.displayInformation) {
        displayInformationOnScreen(data.result.displayInformation);
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

// Function to display information on the screen
function displayInformationOnScreen(info) {

  const displayDiv = document.getElementById("displayInformation");

  // Clear any previous data
  displayDiv.innerHTML = '';
  console.log(info);

  // For Movies or Series
  if (info.title) {
    displayDiv.innerHTML += `<h3>Title: ${info.title}</h3>`;
  }

  if (info.overview) {
    displayDiv.innerHTML += `<p><strong>Overview:</strong> ${info.overview}</p>`;
  }

  // For Books
  if (info.releaseDate) {
    displayDiv.innerHTML += `<p><strong>Release Date:</strong> ${info.releaseDate}</p>`;
  }

  if (info.thumbnail) {
    displayDiv.innerHTML += `<img src="${info.thumbnail}" alt="Book Thumbnail" />`;
  }

  if (info.previewLink) {
    displayDiv.innerHTML += `<p><a href="${info.previewLink}" target="_blank">Preview this Book</a></p>`;
  }

  // For Restaurants
  if (info.name) {
    displayDiv.innerHTML += `<h3>Restaurant Name: ${info.name}</h3>`;
  }

  if (info.address) {
    displayDiv.innerHTML += `<p><strong>Address:</strong> ${info.address}</p>`;
  }

  if (info.rating) {
    displayDiv.innerHTML += `<p><strong>Rating:</strong> ${info.rating}</p>`;
  }

  // For eBay products
  if (info.price) {
    displayDiv.innerHTML += `<p><strong>Price:</strong> $${info.price}</p>`;
  }

  if (info.image) {
    displayDiv.innerHTML += `<img src="${info.image}" alt="Product Image" />`;
  }

  if (info.itemUrl) {
    displayDiv.innerHTML += `<p><a href="${info.itemUrl}" target="_blank">View this Product on eBay</a></p>`;
  }
}
