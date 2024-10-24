$(document).ready(function() {
  const markTaskComplete = (e) => {
    const todoDisplay = $(e).closest('.todo-item-card');
    todoDisplay.toggleClass('completed-item');

    if(todoDisplay.hasClass('completed-item')){
      setTimeout(() => {
        $(e).closest('.todo-item').animate({
          left: "2500",
          opacity: "0"
        }, 800, "swing", function() {
          $(e).closest('.todo-item').remove();
          console.log("animation complete");
        })
      }, 250);
    }
  } 

  $('.todo-item button').on('click', function(e) {
    markTaskComplete(e.target);
  })
});