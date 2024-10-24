$(document).ready(function() {
  const markTaskComplete = (e) => {
    console.log($(e).closest('.todo-item-card'))
    const taskDisplay = $(e).closest('.todo-item-card');
    taskDisplay.toggleClass('completed-item');

    /* if(taskDisplay.hasClass(completed-item)){
      taskDisplay.addClass('completed-item');
    } else {
      taskDisplay.removeClass('completed-item');
    }*/
  } 

  $('.todo-item button').on('click', function(e) {
    markTaskComplete(e.target);
  })
});