document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("manualChangeButton").addEventListener("click", handleManualChange);

  async function handleManualChange(event) {
    event.preventDefault(); // Prevent the form from submitting by default

    const itemName = document.getElementById("itemName").value;
    const newCategory = document.getElementById("categoryDropdown").value;

    try {
      // call backend route /api/todo/itemName to fetch the itemId based on the itemName
      const itemIdResponse = await fetch(`/api/todo/item-id?itemName=${encodeURIComponent(itemName)}`);
      const itemIdData = await itemIdResponse.json();

      if (!itemIdData.itemId) {
        alert('Item not found.');
        return;
      }

      const itemId = itemIdData.itemId;

      // 2nd route with the PUT request if the itemId exists
      const response = await fetch(`/api/todo/${itemId}/category`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({newCategory: newCategory})
      });

      const data = await response.json();
      if (response.ok) {
        alert('Category updated successfully');
      } else {
        console.error(data.error);
        alert('Error updating category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  }
});
