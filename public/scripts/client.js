$(document).ready(function() {
  // targeting todoForm id
  $('#todoForm').on('submit', function(event) {
    event.preventDefault();

    const itemName = $('#item-name').val().trim();
    const $errorContainer = $('.error-container');

    $errorContainer.text('').hide();

    if (!itemName) {
      $errorContainer.text('Item name is required.').slideDown();
      return;
    }

    const formData = $(this).serialize();

    $.ajax({
      type: 'POST',
      url: '/api/todo/categorize',
      data: formData
    })
      .done(function(response) {
        $('form')[0].reset();
        // Handle successful response
      })
      .fail(function(jqxhr) {
        if (jqxhr.status === 409) {
          $errorContainer.text('Item already exists in your to-do list.').slideDown();
        } else {
          $errorContainer.text('Failed to add item. Please try again later.').slideDown();
        }
      });
  });
});
