// Client facing scripts here
$(document).ready(function () {
  let todosData;
  
  if(listData){
    todosData = listData;
  }

  //set the endpoint for the filter to be dynamic to the current path, this allows for the filter system to be used in multiple contexts/pages
  let filterPostURL = `${location.pathname}/filtered`;

  const noHTML = (str) => {
    const regex = /\<\/?[a-z]*\>/gm;

    return String(str).replaceAll(regex, '');
  };

  const createTodo = (todoData) => {
    // const timeagoFormatted = timeago.format(tweetData.created_at);

    const $newTodo = $(`
      <div class="todo-item" id="${todoData.id}">
        <div class="todo-item-card ${todoData.complete ? 'completed-item' : ''}">
          <div class="todo-item-info">
            <button
              type="button"
              class="complete-task-btn"
              name="complete-task"
              value="complete"
            >
            <img src="../assets/checkmark.png"/>
            </button>
            <div class="todo-item-text">
              <span class="todo-item-title">${noHTML(todoData.name)}</span>
              ${todoData.due_date ? `<span class="todo-item-deadline"> ${noHTML(todoData.due_date)} </span>` : ''}
            </div>
          </div>
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    `);

    return $newTodo;
  };


  const renderAllTasks = (allTasks) => {
    for (const task of allTasks) {
      const $singleTask = createTodo(task);
      $('#display-tasks').append($singleTask);
    }
  };

  const loadTasks = (data) => {
    $('#display-tasks').empty();
    renderAllTasks(data);
  };

  loadTasks(todosData);


  //Handle updating the CSS and animating the task card
  function markTaskComplete(e) {
    const todoDisplay = $(e).closest('.todo-item-card');
    todoDisplay.toggleClass('completed-item');

    const taskID = {taskID: $(e).closest('.todo-item').attr('id')};

    $.post('/todos/mark-complete', taskID, ()=> {
      console.log("updated the db");
    })

    /* if (todoDisplay.hasClass('completed-item')) {
      setTimeout(() => {
        $(e).closest('.todo-item').animate({
          left: "2500",
          opacity: "0"
        }, 800, "swing", function () {
          $(e).closest('.todo-item').remove();
          console.log("animation complete");
        })
      }, 250); 
    }*/
  }

  //call markTaskComplete on btn click
  $('body').on('click', '.todo-item-card button', function (e) {
    console.log('clicked ', e.target)
    markTaskComplete(e.target);
  })

  //On filtering the data: get the filters, POST them to the server with the filters, and re-load the tasks based on the return query
  $('.filter-todos').on('submit', function(event){
    event.preventDefault();
    const appliedFilters = $(this).serialize();

    $.post(`${filterPostURL}`, appliedFilters, (data) => {
      todosData = data.data;
      console.log('data is:', data);
      loadTasks(todosData);
      console.log("loaded filtered data");
    })

  })

  
});